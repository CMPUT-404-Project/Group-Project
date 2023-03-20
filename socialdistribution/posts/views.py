from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser 
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from inbox.models import Inbox
from authors.models import Author,FollowRequest
from django.shortcuts import render, redirect
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
import authors.views
import uuid
# Create your views here.

class PostList(APIView):
    
    # parser_classes = (MultiPartParser, FormParser)

    def get(self, request, id):
        query_set = Post.objects.filter(author=id)
        serializer = PostSerializer(query_set, many=True)
        return Response({"type": "posts", "items": serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request, id):
        post_data = request.data
        post_data['author'] = id
        serializer = PostSerializer(data = post_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "post", "id": saved.id}, status=status.HTTP_201_CREATED)
        else:
            print('Error', serializer.errors)
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        post_object = get_object_or_404(Post, id=id)
        post_object.delete()
        return Response({"type": "success", "message": "Post deleted"}, status=status.HTTP_200_OK)

class CommentDetail(APIView):
    def get(self, request, author_id, post_id):
        if request.user.is_authenticated:
            author_object = get_object_or_404(Author, id=author_id)
            post_object = get_object_or_404(Post,id=post_id)
            comments_list = list(post_object.comments.all()) 
            page_number = request.GET.get('page', 1)
            size = request.GET.get('size', 10)
            
            if page_number and size:
                paginator = Paginator(comments, size)
                try:
                    comments = paginator.page(page_number)
                except PageNotAnInteger:
                    comments = paginator.page(1)
                except EmptyPage:
                    comments = paginator.page(paginator.num_pages)
            serializer = CommentSerializer(comments_list, many=True)
            data = {
                "type" : "comments",
                "page" : page_number,
                "size" : len(serializer),
                "post" : serializer.data[0]["post"]["comment_id"],
                "id" : serializer.data[0]["post"]["comment_id"] + "/comments",
                "comments" : []
            }
            for i in serializer.data:
                temp = {}
                for key,item in i.items():
                    if(key!= "type" and key != "post"):
                        temp[key] = item
                data["comments"].append(temp)
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def post(self,request,author_id,post_id):
        comment_data = request.data
        comment_data['post'] = post_id
        serializer = CommentSerializer(data = comment_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "comment", "id": saved.id}, status=status.HTTP_201_CREATED)
        else:
            print('Error', serializer.errors)
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
      
class LikeList(APIView):
    def get(self, request, id):
        Like_object = get_object_or_404(Like, id=id)
        query_set = Like.objects.filter(author=Like_object)
        serializer = LikeSerializer(query_set, many=True)
        return Response({"type": "like", "items": serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request, author_id, post_id):
        post_data = request.data
        post_data['author'] = author_id
        post_data['post'] = post_id
        serializer = LikeSerializer(data = post_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "post", "id": saved.id}, status=status.HTTP_201_CREATED)
        else:
            print('Error', serializer.errors)
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LikeDetail(APIView):
    def get(self, request, id):
        like_object = get_object_or_404(Like, id=id)
        serializer = LikeSerializer(like_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        like_data = request.data
        like_object = get_object_or_404(Comment, id=id)
        serializer = CommentSerializer(like_object, data=like_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        author_object = get_object_or_404(Comment, id=id)
        author_object.delete()
        return Response({"type": "success", "message": "Like deleted"}, status=status.HTTP_200_OK)
    
