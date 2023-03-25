from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<str:post_id>', views.PostDetail.as_view()),
    path('<str:post_id>/comments',views.CommentList.as_view()),
    path('<str:post_id>/likes',views.PostLikes.as_view()),
    path('<str:post_id>/comments/<str:comment_id>/likes',views.CommentLikes.as_view()),
]

