from rest_framework import serializers
from .models import Post, Comment, Like

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['type', 'id', 'post', 'author', 'content_type', 'comment', 'published_date']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['type', 'id', 'author', 'object_summary', 'summary_type', 'published_date']