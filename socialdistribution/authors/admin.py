from django.contrib import admin
from .models import Author, Followers, FollowRequest
# Register your models here.

admin.site.register(Author)
admin.site.register(Followers)
admin.site.register(FollowRequest)