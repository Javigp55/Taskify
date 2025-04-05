from rest_framework import serializers
from .models import task, refresh_token
from django.contrib.auth.models import User

# Creamos Serializador para tareas que convertira la informacion de BBDD a Json
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = task #indicamos el modelo
        #fields = ('id', 'title', 'description', 'done')
        fields = '__all__'

    
    def validate_done(self, value): ## Validacion del campo done.
        if value:  
            tareas_fijadas = task.objects.filter(done=True).exclude(pk=self.instance.pk).count()
            if tareas_fijadas >= 3:
             raise serializers.ValidationError("Solo puedes tener 3 tareas fijadas.")
        return value
    
class UserSerializer(serializers.ModelSerializer): #Serializer de User.
    class Meta:
        model = User
        fields = '__all__'

    ##Validacion para que los campos puestos no los traiga en la peticion POST
    def validate(self, data):

        #Se ponen los campos que desees
        campos = {"is_staff", "is_superuser", "last_login", "is_active", "date_joined", "groups", "user_permissions"}

        #Se crear una intersection, la cual cogera las keys recibidas y las compara con los campos
        #Si existen en los dos valido traera el campo
        valido = campos.intersection(self.initial_data.keys())

        ##Si valido tiene datos
        if valido:
            raise serializers.ValidationError("Has introducido campos no validos.")
        return data



class RefreshSerializer(serializers.ModelSerializer): #Serializer de User.
    class Meta:
        model = refresh_token
        fields = '__all__'