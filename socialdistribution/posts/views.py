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

#added this-Harsh
class PostDetail(APIView):
    def get(self, request, id):
        post_object = get_object_or_404(Post, id=id)
        serializer = PostSerializer(post_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        post_data = request.data
        post_object = get_object_or_404(Post, id=id)
        serializer = PostSerializer(post_object, data=post_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        author_object = get_object_or_404(Post, id=id)
        author_object.delete()
        return Response({"type": "success", "message": "Post deleted"}, status=status.HTTP_200_OK)

class CommentList(APIView):
    def get(self, request, id):
        comment_object = get_object_or_404(Comment, id=id)
        query_set = Comment.objects.filter(author=comment_object)
        serializer = CommentSerializer(query_set, many=True)
        return Response({"type": "followers", "items": serializer.data}, status=status.HTTP_200_OK)