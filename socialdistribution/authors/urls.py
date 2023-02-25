from django.urls import path
from .models import Author
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]