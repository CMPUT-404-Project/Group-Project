from django.urls import include, path
from .models import Author
from . import views

urlpatterns = [
    # path('/login/', views.user_login, name='user_login'),
    # path('/signup/', views.signup, name='signup'),
    
    path('', views.AuthorList.as_view(), name = 'list'),
    path('/<str:id>', views.AuthorDetail.as_view(), name = 'detail'),
    path('/<str:id>/followers', views.FollowersList.as_view()),
    path('/<str:id>/followers/<str:fid>', views.FollowersDetail.as_view()),
    path('/<str:id>/followers/sendrequest/', views.SendFollowRequest.as_view()),
    path('/<str:id>/posts', include('posts.urls')),
    path('/<str:id>/inbox', include('inbox.urls')),
]