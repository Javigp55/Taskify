from django.contrib import admin
from .models import task, refresh_token
# Register your models here.

admin.site.register(task)
admin.site.register(refresh_token)