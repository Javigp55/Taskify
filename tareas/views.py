from django.shortcuts import render
from rest_framework import viewsets
from .serializer import TaskSerializer, RefreshSerializer
from .models import task, refresh_token
from rest_framework.response import Response
from rest_framework.decorators import api_view, action, authentication_classes, permission_classes
from rest_framework import status
from .serializer import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .authenticate import CustomAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Create your views here.

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = task.objects.all()

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

@api_view(["POST"])
def register(request):
    #PAsamos por el serializer de usuario los datos recibidos
    serializer = UserSerializer(data=request.data)
    #Si son validos
    if serializer.is_valid():

        #se guardan en la base de datos
        serializer.save()
        #Se busca al mismo usuario que acabamos de guardar
        user = User.objects.get(username=request.data['username'])
        #Le metemos la contraseña encriptada
        user.set_password(request.data['password'])
        #Guardamos y mandamos mensaje 200 OK
        user.save() 
        return Response({"message":"Usuario creado con exito"}, status = status.HTTP_200_OK)
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    #Comprobamos que se haya recibido el usuario y contraseña y sino muestra error
    if not request.data.get('username') or not request.data.get('password'):
        return Response({"error":"Se necesita un usuario y contraseña"}, status = status.HTTP_400_BAD_REQUEST)
    try:# comprobamos que el usuario existe
        user = User.objects.get(username=request.data['username']) #buscamos el usuario
        #comprobamos la contraseña que viene encriptada
        passw = user.check_password(request.data['password'])
        #Si es incorrecta lanzara un error
        if not passw:
            return Response({"error":"La contraseña es incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
        #Desde la funcion get_tokens_for_user recibimos los tokens access y refresh de nuestro usuario
        data = get_tokens_for_user(user)

        #Creamos el response
        response = Response({"message": "Login exitoso"}, status=status.HTTP_200_OK)
        #Generamos la cookie con nuestro access data en el response y sera guardado en navegador.
        response.set_cookie(
            key="access_token", 
            value=data['access'], 
            httponly=True,     # protección contra XSS
            secure=True,      # requiere HTTPS
            samesite="None",    # CSRF
            max_age=60 * 60 * 24 * 7 ,# 7 dias
        )

        #Guardamos tanto acces como refresh junto al usuario para mayor seguridad
        refresh_user, created = refresh_token.objects.update_or_create(
            user=user, 
            defaults={'token':data['refresh'], 'access':data['access']}
            )
        #Ejecutamos response
        return response

 
    except User.DoesNotExist: #Si usuario no existe
        return Response({"error":"El usuario no existe"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"error":"Algo ha salido mal"})

@api_view(["GET"])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion que creamos en autheticate.py
@permission_classes([IsAuthenticated]) #Esto indica que la ruta esta protegida por autentificacion.
def recibir_tareas(request):
    
    #Pasams usuario por serializer
    userserializer = UserSerializer(request.user)
    #cogemos todas las tareas que el usuario tenga

    tarea = task.objects.filter(usuario=userserializer.data['id']).all()
    if not tarea.exists():
        return Response({"status": False})
    serializer = TaskSerializer(tarea, many=True)
    return Response(serializer.data)



    


@api_view(["POST"])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAuthenticated]) #Esto indica que la ruta esta protegida por autentificacion.
def crear_tareas(request):

    # Metemos los datos del POST en una variable
    data = request.data

    # Dentro de estos datos le decimos que en usuario le metemos el id de nuestro TOKEN.
    data['usuario'] = request.user.id

    #Metemos los datos en el serializer
    serializer = TaskSerializer(data=data)

    #Si es valido
    if serializer.is_valid():

        #Guardamos
        serializer.save()
        return Response({"message":"La tarea se ha creado con exito"}, status = status.HTTP_200_OK)
    return Response(serializer.errors  , status= status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@authentication_classes([CustomAuthentication])
@permission_classes([IsAuthenticated])
def borrar(request):
    ##Si no recibe el id como parametro
    if not request.data.get('id'):
        return Response({"error":"No se ha proporcionado un id"}, status=status.HTTP_400_BAD_REQUEST)
    ##Buscamos el objeto que queremos borrar
    ##Se puede usar tambien metodo que tenemos el filtrar con .get y usando el try y except
    buscar = task.objects.filter(id=request.data['id']).first()
    
    #Si buscar no se encuentra
    if not buscar:
        return Response({"error":"No se encuentra la tarea"}, status=status.HTTP_400_BAD_REQUEST)
    
    #Ahora comparamos el id de usuario de la tarea con el id del request para saber que es el propietario
    if buscar.usuario.id == request.user.id:
        buscar.delete()
        return Response({"message":"Has borrado la tarea con exito."}, status= status.HTTP_200_OK)
    else:
        return Response({"error":"Esta tarea no te pertenece"}, status=status.HTTP_401_UNAUTHORIZED)

    


@api_view(["PATCH"])
@authentication_classes([CustomAuthentication]) #Esto es para que te tengas que mandar un hearder con la propiedad token.
@permission_classes([IsAuthenticated])
def fijar(request):
    ##Si no recibe el id como parametro
    if not request.data.get('id'):
        return Response({"error":"No se ha proporcionado un id"}, status=status.HTTP_400_BAD_REQUEST)
    try: # prueba

        ##Variable tarea con objeto la tarea seleccionada por el id
        tarea = task.objects.get(id=request.data['id'])
        
        ##Si el id vinculado a tarea de usuario y el id de usuario del request no es el mismo
        if tarea.usuario.id != request.user.id:
            return Response({"error":"Esta tarea no te pertenece"},status=status.HTTP_400_BAD_REQUEST)
        
        ##Se cuenta cuantas tareas tiene un usuario fijadas
        conteo = task.objects.filter(usuario=request.user.id, done=True).count()
        
        #Si son menos de 3 o es True se ejecuta el cambio
        if conteo < 3 or tarea.done == True:
            tarea.done = not tarea.done
            tarea.save()
        else:
            return Response({"error":"No puedes tener mas de 3 tareas fijadas"}, status=status.HTTP_400_BAD_REQUEST)
        
        ##Dependiendo de que vale tenga Done muestra un mensaje u otro
        if tarea.done == True:
            return Response({"message":"La tarea se ha fijado"})
        else:
            return Response({"message":"La tarea se ha desfijado"})

    except task.DoesNotExist: # Si el TRY no funciona porque no encontro la tareas
        return Response({"error":"Tarea no encontrada"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({})


@api_view(['PUT'])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion por cookies que creamos en autheticate.py
@permission_classes([IsAuthenticated])# Solo accesible si estas autenticado
def editar(request):
    print(request.data)
    try:
        tarea = task.objects.get(id=request.data.get('id'))
        serializer = TaskSerializer(tarea, data=request.data , partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Tarea editada con exito"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except task.DoesNotExist:
        return Response({"error":"La tarea no existe"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({})

    


@api_view(['POST'])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion por cookies que creamos en autheticate.py
@permission_classes([IsAuthenticated])# Solo accesible si estas autenticado
def logout(request):
    try:
        #metemos response en variable para poder eliminar cookies despues
        res = Response({"message":"Logout completado."})

        #pillamos el usuario que hace la peticion
        user = request.user

        #borramos las cookies
        res.delete_cookie('access_token',path='/', samesite='None')

        #buscamos el token asociado al usuario
        token = refresh_token.objects.get(user=user.id)

        #lo borramos
        token.delete()

        #devolvemos res para que se ejecute
        return res
    except:
        return Response({"error"})
        

    return Response({})

@api_view(['POST'])
def refresh(request):

    ##Recibimos el access token de la cookie del navegador
    access_token = request.COOKIES.get('access_token')

    ##Si no hay cookie error
    if not access_token:
        return Response({"error":"No hay token disponible"}, status=status.HTTP_400_BAD_REQUEST)
    
    #Comprobar si existe en la base de datos
    try:
        token = refresh_token.objects.get(access=access_token)

        ##Una vez encontrado el access caducado cogemos el refreh que sigue funcionando
        refresh = token.token

        #Generamos un nuevo token
        nuevo_token = RefreshToken(refresh)

        #Lo metemos en una variable porque si lo llamas mas veces vuelve a generar mas
        nuevo_access = nuevo_token.access_token

        #Creamos el response con el set cookies con el nuevo access token
        response = Response({"message":"Refrescado con exito"})
        response.set_cookie(
            key="access_token",  
            value=str(nuevo_access),   
            httponly=True,     # protección contra XSS
            secure=True,      # HTTPS
            samesite="None",    # Evita CSRF
            max_age=60 * 60 * 24 * 7  # días
        )
        
        #el nuevo token lo metemos en el objeto
        token.access = nuevo_access

        #Guardamos
        token.save()
        return response

    except TokenError as e: #Si no existe o es invalido
        return Response(
            {"error": "El refresh token es inválido o ha expirado"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    

@api_view(["POST"])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion que creamos en autheticate.py
@permission_classes([IsAuthenticated])   
def tarea(request):
    try:
    #buscamos la tarea
        tarea = task.objects.get(id=request.data.get('id'))
    #metemos al usuario en el serializer
        userserializer = UserSerializer(request.user)
        #condicional si el id de usuario y tarea es la misma
        if tarea.usuario.id == userserializer.data['id']:
            ##Si es el mismo mostramos la tarea solicitada
            serializer = TaskSerializer(tarea)
            return Response(serializer.data)
        else: #Sino muestra error
            return Response({"error":"Esta tarea no te pertenece"}, status=status.HTTP_400_BAD_REQUEST)

    except task.DoesNotExist:#Si no existe
        return Response({"error":"No existe la tarea"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["DELETE"])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion que creamos en autheticate.py
@permission_classes([IsAuthenticated])   
def borrartareas(request):

    userserializer = UserSerializer(request.user)
    #cogemos todas las tareas que el usuario tenga

    tarea = task.objects.filter(usuario=userserializer.data['id']).all()

    tarea.delete()

    return Response({"message":"Tareas eliminadas"})

@api_view(["DELETE"])
@authentication_classes([CustomAuthentication]) #Se ejecuta la autentificacion que creamos en autheticate.py
@permission_classes([IsAuthenticated])   
def borrarusuario(request):

    user = User.objects.get(id=request.user.id)
    #cogemos todas las tareas que el usuario tenga

    user.delete()

    return Response({"message":"Usuario eliminado"})