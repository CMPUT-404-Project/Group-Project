from django.contrib import admin
from .models import Author, FollowRequest
# Register your models here.

admin.site.register(Author)
admin.site.register(FollowRequest)