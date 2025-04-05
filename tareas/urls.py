from django.urls import path, include
from rest_framework import routers
from tareas import views
from .views import editar, register, borrarusuario, login,borrartareas, recibir_tareas, crear_tareas, borrar, fijar, logout, refresh, tarea
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register('task', views.TaskView, 'tasks')
router.register('user', views.UserView, 'users')


urlpatterns = [
    path("api/", include(router.urls)),
    path("api/register/", register, name="register"),   
    path("api/login/", login, name="login"),
    path("api/recibir-tareas/", recibir_tareas, name="recibir_tareas"),    
    path("api/crear-tareas/", crear_tareas, name="crear_tareas"),    
    path("api/borrar/", borrar, name="borrar"),    
    path("api/fijar/", fijar, name="fijar"),    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/logout/", logout, name="logout"),
    path("api/refresh/", refresh, name="refresh"),    
    path("api/tarea/", tarea, name="tarea"),
    path("api/editar/", editar, name="editar"),
    path("api/borrartareas/", borrartareas, name="borrartareas"),
    path("api/borrarusuario/", borrarusuario, name="borrarusuario"),

]