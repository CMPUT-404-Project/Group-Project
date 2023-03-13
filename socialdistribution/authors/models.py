from django.db import models
from django.utils.timezone import now
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserAccountManager()

    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        # Check if the user has the specified permission
        return self.is_superuser
    def has_module_perms(self, app_label):
        # Check if the user has permissions 
        if self.is_superuser:
            return True
        return False

# Create your models here.
class Author(models.Model):
    # user_name = models.CharField(unique=True)
    customuser = models.OneToOneField('authors.CustomUser', on_delete=models.CASCADE, related_name='author', default=None)
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
