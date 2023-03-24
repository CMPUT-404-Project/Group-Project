from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Inbox
from .serializers import InboxSerializer

from authors.models import Author
from authors.models import FollowRequest
from authors.serializers import FollowRequestSerializer
from posts.models import Post,Comment,Like
from posts.serializers import PostSerializer,CommentSerializer,LikeSerializer
from drf_yasg.utils import swagger_auto_schema



def get_inbox(data):
    if data['type'] == 'post':
        return Post.objects.get(id=data['id'])
    elif data['type'] == 'follow':
        return FollowRequest.objects.get(id=data['id'])
    elif data['type'] == 'comment':
        return Comment.objects.get(id=data['id'])
    elif data['type'] == 'like':
        return Like.objects.get(id=data['id'])
    

def ser_inbox_items(item):
    item_model = item.content_type.model_class()
    if item_model is Post:
        ser = PostSerializer
    elif item_model is FollowRequest:
        ser = FollowRequestSerializer
    elif item_model is Comment:
        ser = CommentSerializer
    elif item_model is Like:
        ser = LikeSerializer
    return ser(item.object).data

class InboxDetail(APIView):
    @swagger_auto_schema(operation_description="Get inbox of the current author", responses={200: InboxSerializer(many=True)})
    def get(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        # if not request.user.is_authenticated:
        #     return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)
        # if request.user.id != author.user.id:
        #     return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_400_BAD_REQUEST) 
        
        inbox_object = Inbox.objects.filter(author=author)
        inbox_data = [ser_inbox_items(item) for item in inbox_object]
        return Response({"type": "inbox", "author": author.url, "items":inbox_data}, status=status.HTTP_200_OK)
    

    @swagger_auto_schema(operation_description="Add inbox of the current author", responses={200: "type: success, message: Inbox added", 400: "type: error, message: Error adding inbox"})
    def post(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        data = get_inbox(request.data)
        if data:
            inbox_object = Inbox(author=author, object=data)
            inbox_object.save()
            return Response({"type": "success", "message": "Inbox added"}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": "Error adding inbox"}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete inbox of the current author", responses={200: "type: success, message: Inbox deleted"})
    def delete(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        # if not request.user.is_authenticated:
        #     return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)
        # if request.user.id != author.user.id:
        #     return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_400_BAD_REQUEST) 
        
        inbox_object = Inbox.objects.all().filter(author=author)
        inbox_object.delete()
        return Response({"type": "success", "message": "Inbox deleted"}, status=status.HTTP_200_OK)
