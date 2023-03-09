from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField

from authors.models import Author
import uuid 

def generate_uuid():
    return uuid.uuid4().hex

# Create your models here.
class Post(models.Model):

     # To use choices I followed this: https://www.geeksforgeeks.org/how-to-use-django-field-choices 
    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64'),
        #('multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW','multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')
    )

    VISIBILITY = (
        ("PUBLIC","public"),
        ("FRIENDS","friends"),
        ("PRIVATE","private"),
    )
    # The type should be constant
    type = models.CharField(max_length=20,default="post", editable=False)
    title = models.CharField(max_length=200)
    id = models.UUIDField(primary_key=True, default=generate_uuid, max_length=200, editable=False)
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

    # The type should be constant
    type = models.CharField(max_length=200,default="Comment", editable=False)
    #id, the primary key
    comment_id = models.UUIDField(primary_key=True)
    #post where comment posted
    post = models.ForeignKey(Post,related_name='comments',on_delete=models.CASCADE)
    #author of the comment
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    #content type of the comment
    content_type = models.CharField(max_length=150,choices=CONTENT_TYPE,default='text/plain')
    #comment on post
    comment = models.TextField()
    #date comment was published
    published_date = models.DateTimeField('date published', default=now)
    
    def get_id(self):
        return self.id

class Like(models.Model):

    TYPE = (
        ('post','post'),
        ('comment','comment')
    )
    # The type should be constant
    type = models.CharField(max_length=200,default="Like", editable=False)
    #id, the primary key
    like_id = models.UUIDField(primary_key=True)
    #author of the comment
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    #url of object which is being liked
    object_summary = models.URLField(null=True,editable=False)
    #summary of the 
    summary_type = models.CharField(max_length=250,null=True,choices=TYPE)
    #date comment was published
    published_date = models.DateTimeField('date published', default=now)


    def get_id(self):
        return self.id
    
    def summary(self):
        return self.author + "Likes your" + self.summary_type