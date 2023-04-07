from django.urls import include, path
from .models import Author
from . import views
from posts.urls import urlpatterns as posts_urlpatterns

urlpatterns = [

    path('/login/', views.user_login, name='user_login'),
    path('/signup/', views.signup, name='signup'),
    path('/github/', views.GithubActivity.as_view(), name='github'),
    
    path('', views.AuthorList.as_view(), name = 'list'),
    path('/<str:author_id>', views.AuthorDetail.as_view(), name = 'detail'),
    path('/<str:author_id>/followers/', views.FollowersList.as_view()),
    path('/<str:author_id>/followers/<str:follower_id>', views.FollowersDetail.as_view()),
    path('/<str:author_id>/sendrequest/', views.SendFollowRequest.as_view()),
    #path('/<str:author_id>/posts', include('posts.urls')),
    path('/<str:author_id>/posts/', include(posts_urlpatterns)),
    path('/<str:author_id>/inbox', include('inbox.urls')),
    path('/<str:author_id>/liked', views.AuthorLiked.as_view(), name = 'liked'),
]