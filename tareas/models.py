from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class task(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["-date"]

class refresh_token(models.Model):
    token = models.CharField(unique=True)
    access = models.CharField(unique=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.user.username