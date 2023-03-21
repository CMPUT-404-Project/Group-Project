from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<str:pid>', views.PostDetail.as_view()),
    path('<str:pid>/comments/<str:cid>',views.CommentDetail.as_view()),
    path('<str:pid>/likes',views.LikesDetail.as_view()),

]

