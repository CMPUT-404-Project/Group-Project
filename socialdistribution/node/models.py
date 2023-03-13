from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField

from authors.models import Author
import uuid 

def generate_uuid():
    return uuid.uuid4().hex

# Create your models here.
class Node(models.Model):
    host = models.URLField(primary_key=True)
    #auth info
    username = models.CharField(max_length=50,blank=True,null=True)
    password = models.CharField(max_length=50,blank=True,null=True)
    #team
    team_name = models.CharField(max_length=50,blank=True)
    #auth info to be provided by our server for making requests to other servers.
    request_auth_info = models.CharField(max_length=100, blank=True)
    #tells server that it should connect to this node 
    connect_node = models.BooleanField(default=True)
    # Check if authentication is required
    require_auth = models.BooleanField(default=True)
    # Use auth to connect
    connect_with_auth = models.BooleanField(default=True)