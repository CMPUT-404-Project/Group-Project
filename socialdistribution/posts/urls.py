from django.urls import path
from . import views

urlpatterns = [
    #posts
    path('authors/<uuid:id>/posts/', views.PostList.as_view()),
    path('authors/<uuid:id>/posts/<uuid:fid>', views.PostDetail.as_view()),
    #Comments
    path('authors/<uuid:id>/posts/<uuid:fid>/comments/',views.CommentList.as_view()),
    #the second id is the id of specific comment
    path('authors/<uuid:id>/posts/<uuid:fid>/comments/<uuid:id>',views.CommentDetail.as_view()),
    #likes
    path('authors/<uuid:id>/posts/<uuid:fid>/likes/',views.LikeList.as_view()),
    #second id referes to specific like
    path('authors/<uuid:id>/posts/<uuid:fid>/likes/<uuid:id>',views.LikeDetail.as_view())
]