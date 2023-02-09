from django.db import models

# Create your models here.

class Author(models.Model):
    id = models.AutoField(primary_key=True)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    github = models.CharField(max_length=200)

    def __str__(self):
        return self.displayName