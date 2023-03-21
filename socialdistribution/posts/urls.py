from django.urls import path
from . import views

urlpatterns = [
    #posts
    path('', views.PostList.as_view()),
    path('<str:pid>', views.PostDetail.as_view()),
    #Comments
    path('<str:pid>/comments/',views.CommentList.as_view()),
    # path('<uuid:id>/comments/',views.CommentList.as_view()),
    #the second id is the id of specific comment
    path('<str:pid>/comments/<str:cid>',views.CommentDetail.as_view()),
    #likes
    path('<str:pid>/likes/',views.LikeList.as_view()),
    #second id referes to specific like
    path('<str:pid>/likes/<str:lid>',views.LikeDetail.as_view()),
    # path('<uuid:id>/likes/',views.LikeList.as_view()),
    #second id referes to specific like
    # path('<uuid:id>/likes/<uuid:like_id>',views.LikeDetail.as_view()),
    path('<uuid:id>/likes',views.LikesDetail.as_view()),


    
]

