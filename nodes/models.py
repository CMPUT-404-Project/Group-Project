from django.db import models

# Create your models here.

class Node(models.Model):
    team_num= models.IntegerField(primary_key=True)
    api_author_url = models.CharField(max_length=255, blank=True, null=True)
    api_inbox_prefix = models.CharField(max_length=255, blank=True, null=True)
    auth_token = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)