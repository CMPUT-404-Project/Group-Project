from django.urls import path
from . import views

urlpatterns = [
    path('authors/<uuid:id>/inbox/', views.InboxDetail.as_view()),
]