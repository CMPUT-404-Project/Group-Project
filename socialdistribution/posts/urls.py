from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<str:pid>', views.PostDetail.as_view()),
    path('<str:pid>/comments',views.CommentList.as_view()),
    path('<str:pid>/likes',views.PostLikes.as_view()),

]

