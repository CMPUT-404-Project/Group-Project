from django.contrib import admin
from .models import Author,Post,Comment,Like,Inbox

# Register your models here.
admin.site.register(Author)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Inbox)