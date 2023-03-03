from rest_framework import serializers
from .models import Author, Followers, FollowRequest

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profile_image']

class FollowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRequest
        fields = ['id', 'summary', 'type', 'actor', 'object', 'status', 'request_time']