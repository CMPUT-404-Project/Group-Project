from django.urls import path
from . import views

urlpatterns = [
    path('', views.InboxDetail.as_view()),
]
