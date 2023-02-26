from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
# Create your views here.

class PostList(APIView):
    def get(self, request, id):
        query_set = Post.objects.filter(author=id)
        serializer = PostSerializer(query_set, many=True)
        return Response({"type": "posts", "items": serializer.data}, status=status.HTTP_200_OK)
