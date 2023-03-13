from django.db import models
from django.utils.timezone import now
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

import uuid
from inbox.models import Inbox

def generate_uuid():
    return str(uuid.uuid4().hex)

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
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        return True
    
    def get_id(self):
        return self.id
    
    def get_is_staff(self):
        return self.is_staff
    
    def get_is_active(self):
        return self.is_active
    
    def get_is_superuser(self):
        return self.is_superuser
    


# Create your models here.
class Author(models.Model):
    # user_name = models.CharField(unique=True)
    customuser = models.OneToOneField('authors.CustomUser', on_delete=models.CASCADE, related_name='author', default=None)
    id  = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
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


class FollowRequest(models.Model):
    id  = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    type = models.CharField(max_length=20,default="Follow", editable=False)
    summary = models.CharField(max_length=300, default="Follow Request", editable=False)
    actor = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='actor', unique=False)
    object = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='object')
    status = models.BooleanField(default=False)
    request_time = models.DateTimeField('date request came', default=now) 
    #inbox = GenericRelation(Inbox, ON_DELETE=models.CASCADE, related_query_name='inbox')    
