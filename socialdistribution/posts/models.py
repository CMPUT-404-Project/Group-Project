from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericRelation

from authors.models import Author
from inbox.models import Inbox
import uuid 

def generate_uuid():
    return uuid.uuid4().hex

class Post(models.Model):

     # To use choices I followed this: https://www.geeksforgeeks.org/how-to-use-django-field-choices 
    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64'),
        #('multipart/form-data; boundary=----   W','multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')
    )

    VISIBILITY = (
        ("PUBLIC","public"),
        ("FRIENDS","friends"),
        ("PRIVATE","private"),
    )
    type = models.CharField(max_length=20,default="post", editable=False)
    title = models.CharField(max_length=200)
    id = models.CharField(primary_key=True, default=generate_uuid, max_length=200)
    source = models.URLField(max_length=200,blank=True,null=True)
    origin = models.URLField(max_length=200,blank=True,null=True)
    description = models.CharField(max_length=500,blank=True,null=True)
    content_type = models.CharField(max_length=50,choices=CONTENT_TYPE,default='text/plain')
    #image =  models.ImageField(upload_to='post_images',null=True, blank= True)
    imagesrc = models.URLField(max_length=500, null=True, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posted')
    categories = ArrayField(models.CharField(max_length=200), blank=True, null=True)  
    published = models.DateTimeField('date published',default=now)
    visibility = models.CharField(max_length=100,choices=VISIBILITY, default='PUBLIC')
    unlisted = models.BooleanField(default=False)
    inbox = GenericRelation(Inbox, related_query_name='post')
    
    def __str__(self):
        return self.title + "(" + str(self.id) + ")"    

    #returns id of the post
    def get_id(self):
        return self.id
    
class Comment(models.Model):

    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain')
    )

    type = models.CharField(max_length=200,default="comment", editable=False)
    id = models.CharField(primary_key=True, default=generate_uuid, max_length=200)
    post = models.ForeignKey(Post,related_name='comments',on_delete=models.CASCADE)
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    contentType = models.CharField(max_length=150,choices=CONTENT_TYPE,default='text/plain')
    comment = models.TextField()
    published = models.DateTimeField('date published', default=now)
    
    def get_id(self):
        return self.id

class Like(models.Model):

    OBJECT_TYPE = (
        ('post','post'),
        ('comment','comment')
    )
    type = models.CharField(max_length=200,default="Like", editable=False)
    id = models.CharField(primary_key=True, default=generate_uuid, max_length=200)
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    #object = models.URLField(null=True,editable=False)
    object = models.URLField(null=True,max_length=300)
    object_type = models.CharField(max_length=150,choices=OBJECT_TYPE,default='post')
    summary = models.CharField(max_length=300,null=True,editable=False)
    published_date = models.DateTimeField('date published', default=now)

    def get_id(self):
        return self.id
    
    def summary(self):
        return self.author + "Likes your" + self.summary