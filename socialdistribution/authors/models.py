from django.db import models
from django.utils.timezone import now
import uuid

# Create your models here.
class Author(models.Model):
    # user_name = models.CharField(unique=True)
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
