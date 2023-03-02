from django.db import models
from django.utils.timezone import now
import uuid
from django.contrib.auth.models import AbstractUser

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # host = models.CharField(max_length=200)
    # displayName = models.CharField(max_length=200)
    # url = models.CharField(max_length=200)
    # github = models.CharField(max_length=200)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserAccountManager()

    def __str__(self):
        return self.email


# Create your models here.
class Author(models.Model):
    # user_name = models.CharField(unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='author', default=None)
    id  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=20,default="author", editable=False)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200,unique=True)
    url = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profile_image = models.ImageField(upload_to='profile_images',null=True,default='blank_profile.png')

    #returns id of the author
    def get_id(self):
        return self.id 
    
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
