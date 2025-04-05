from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

class CustomAuthentication(JWTAuthentication):
    #Creamos funcion autenticar
    def authenticate(self, request):
        #Cogemos el access token de las cookies
        access_token = request.COOKIES.get('access_token')
        #Si no hay retorna None(error)
        if not access_token:
            return None
            

        #Creamos una variable donde validamos el access token sea correcto
        validated_token = self.get_validated_token(access_token)

        #Devolvemos el usuario del token y el token validado
        return self.get_user(validated_token), validated_token