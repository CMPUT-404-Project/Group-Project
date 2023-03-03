from django.db import models
from django.utils.timezone import now

from authors.models import Author

# Create your models here.
class Post(models.Model):

     # To use choices I followed this: https://www.geeksforgeeks.org/how-to-use-django-field-choices 
    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64'),
        ('multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW','multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')
    )

    VISIBILITY = (
        ("PUBLIC","PUBLIC"),
        ("FRIENDS","FRIENDS")
    )
    # The type should be constant
    type = models.CharField(max_length=20,default="Post", editable=False)
    #id, the primary key
    id = models.UUIDField(primary_key=True) #?URL Field?
    #title of the post
    title = models.CharField(max_length=200)
    #type of post
    content_type = models.CharField(max_length=150,choices=CONTENT_TYPE,default='text/plain')
    #content of the post
    content = models.TextField(blank=True,null=True)

    #uploading an image
    image =  models.ImageField(upload_to='post_images',null=True, blank= True)

    #caption of the post
    caption = models.CharField(max_length=300,blank=True,null=True)
    #author of the post
    #the on_delete = models.CASCADE deletes all the foreignkey pointing to author from the AUTHOR object
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posted')
    #number of likes
    count_likes = models.IntegerField(default=0)
    #time post was published
    published_time = models.DateTimeField('date published',default=now)
    #visibility of the post
    visibility = models.CharField(max_length=100,choices=VISIBILITY, default='PUBLIC')
    
    def __str__(self):
        return self.title + "(" + str(self.id) + ")"

    #returns id of the post
    def get_id(self):
        return self.id
    
    #returns number of likes on the post
    def num_likes(self):
        return self.count_likes

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