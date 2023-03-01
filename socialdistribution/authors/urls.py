from django.urls import include, path
from .models import Author
from . import views
from .views import signup, user_login

urlpatterns = [
    path('/signup/', signup, name='signup'),
    path('/login/', user_login, name='user_login'),
    path('', views.AuthorList.as_view(), name = 'list'),
    path('/<uuid:id>', views.AuthorDetail.as_view()),
    path('/<uuid:id>/followers', views.FollowersList.as_view()),
    path('/<uuid:id>/followers/<uuid:fid>', views.FollowersDetail.as_view()),
    path('/<uuid:id>/posts', include('posts.urls')),
    path('/<uuid:id>/inbox', include('inbox.urls')),
]