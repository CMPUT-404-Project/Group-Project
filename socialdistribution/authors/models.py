from django.db import models
from django.utils.timezone import now
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password as check_password_hash
from django.utils import timezone


    
class Author(models.Model):
    # user_name = models.CharField(unique=True)
    id = models.AutoField(primary_key=True, editable=False)
    #id  = models.CharField(primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=20,default="author", editable=False)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200,unique=True)
    url = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profile_image = models.ImageField(upload_to='profile_images',null=True,default='blank_profile.png')

    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(default=timezone.now, editable=False)

    USERNAME_FIELD = 'username'
   
    #returns id of the author
    def get_id(self):
        return self.id 
    
    def set_password(self, password):
        self.password = make_password(password)
    
    def check_password(self, password):
        return check_password_hash(password, self.password)
    
    def __str__(self):
        return str(self.displayName) + '-' + str(self.id)
    
class Followers(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='author', editable=False)
    followers = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='followers', editable=False)
    
    def __str__(self):
        return str(self.author) + '-' + str(self.followers_id)

class FollowRequest(models.Model):
    id  = models.UUIDField(primary_key=True)
    summary = models.CharField(max_length=200)
    type = models.CharField(max_length=20,default="Follow", editable=False)
    actor = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='actor')
    object = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='object')
    status = models.BooleanField(default=False)
    request_time = models.DateTimeField('date request came', default=now) 
