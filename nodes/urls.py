from django.urls import path
from . import views

urlpatterns = [
    path('', views.NodeView.as_view()),
]
