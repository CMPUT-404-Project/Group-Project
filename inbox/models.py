from django.db import models
from django.utils.timezone import now
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

import uuid

def generate_uuid():
    return str(uuid.uuid4().hex)

# Create your models here.
class Inbox(models.Model):    
    # The type should be constant
    type = models.CharField(max_length=200,default="inbox", editable=False)
    #id
    id = models.CharField(primary_key=True, default=generate_uuid, max_length=200)
    #author that the inbox object is sent to
    author = models.ForeignKey('authors.Author', on_delete=models.CASCADE)
    #Object to sent to author
    #https://docs.djangoproject.com/en/4.1/ref/contrib/contenttypes/
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.CharField(max_length=200, null=True)
    object = GenericForeignKey('content_type', 'object_id')
    #date something came in Inbox
    published_date = models.DateTimeField('date published', default=now)