from django.db import models
from django.utils.timezone import now

# Create your models here.
class Inbox(models.Model):

    TYPE = (
        ('post','post'),
        ("comment","comment"),
        ('like','like'),
        ("follow","follow")
    )
    
    # The type should be constant
    type = models.CharField(max_length=200,default="inbox", editable=False)
    #id
    id = models.UUIDField(primary_key=True)
    #type of object selected
    object_type = models.CharField(max_length=250,null=True,choices=TYPE)
    #date something came in Inbox
    published_date = models.DateTimeField('date published', default=now)