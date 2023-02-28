from django.urls import path
from . import views

urlpatterns = [
    #posts
    path('', views.PostList.as_view()),
    path('/<uuid:id>', views.PostDetail.as_view()),
    #Comments
    path('<uuid:id>/comments/',views.CommentList.as_view()),
    #the second id is the id of specific comment
    path('<uuid:id>/comments/<uuid:comment_id>',views.CommentDetail.as_view()),
    #likes
    path('<uuid:id>/likes/',views.LikeList.as_view()),
    #second id referes to specific like
    path('<uuid:id>/likes/<uuid:like_id>',views.LikeDetail.as_view()),
]

