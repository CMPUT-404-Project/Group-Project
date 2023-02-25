from django.db import models
from django.utils.timezone import now

# Create your models here.
class Author(models.Model):
    id = models.UUIDField(primary_key=True)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profile_image = models.ImageField(upload_to='profile_images',null=True,default='blank_profile.png')

    #returns id of the author
    def get_id(self):
        return self.id
    
    def __str__(self):
        return str(self.displayName) + '-' + str(self.id)
    
class Followers(models.Model):
    id = models.UUIDField(primary_key=True)
    author = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='author')

    # followers = models.ManyToManyField(Author,related_name='followers')
    #You can change this to many to many
    followers = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='followers')
    #added the following part as well
    following = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='following')
    
    def __str__(self):
        return str(self.author) + '-' + str(self.id)

class FollowRequest(models.Model):
    id = models.UUIDField(primary_key=True)
    summary = models.CharField(max_length=200)
    type = models.CharField(max_length=20,default="Follow", editable=False)
    actor = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='actor')
    object = models.ForeignKey(Author,on_delete=models.CASCADE,related_name='object')
    status = models.BooleanField(default=False)
    #added the time as well
    request_time = models.DateTimeField('date request came', default=now) 
