from rest_framework import serializers
from .models import Post, Comment, Like

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['type', 'title', 'id', 'content_type', 'content', 'caption', 'author', 'count_likes',  'published_time', 'visibility']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['type', 'comment_id', 'post', 'author', 'content_type', 'comment', 'published_date']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['type', 'like_id', 'author', 'object_summary', 'summary_type', 'published_date']