from django.db import models
from django.utils.timezone import now

# Create your models here.

class Author(models.Model):
    id = models.AutoField(primary_key=True)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    #added this -Harsh
    profile_image = models.URLField(max_length=200, blank=True,null=True,default="")

    #returns id of the author
    def get_id(self):
        return self.id
    
    def __str__(self):
        return str(self.displayName) + '-' + str(self.id)
    

    
class Post(models.Model):

     # To use choices I followed this: https://www.geeksforgeeks.org/how-to-use-django-field-choices 
    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64')
    )

    VISIBILITY = (
        ("PUBLIC","PUBLIC"),
        ("FRIENDS","FRIENDS")
    )
    #id, the primary key
    id = models.AutoField(primary_key=True)
    #title of the post
    title = models.CharField(max_length=200)
    #type of post
    content_type = models.CharField(max_length=150,choices=CONTENT_TYPE,default='text/plain')
    #content of the post
    content = models.TextField(blank=True,null=True)
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
    visibility = models.CharField(choices=VISIBILITY, default='PUBLIC')
    
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

    #id, the primary key
    id = models.AutoField(primary_key=True)
    #post where comment posted
    post = models.ForeignKey(Post,related_name='comments')
    #author of the comment
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    #content type of the comment
    content_type = models.CharField(max_length=150,choices=CONTENT_TYPE,default='text/plain')
    #comment on post
    comment = models.TextField()
    #date comment was published
    published_date = models.DateTimeField('date published', default=now)
    



class Like(models.Model):
    #id, the primary key
    id = models.AutoField(primary_key=True)
    #post where comment posted
    post = models.ForeignKey(Post,related_name='comments')
    #author of the comment
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    #date comment was published
    published_date = models.DateTimeField('date published', default=now)

class Inbox(models.Model):
    pass

