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
import base64
from authors.serializers import AuthorSerializer
# import django.db.models.signals 
from django.db.models.signals import post_save
from drf_yasg.utils import swagger_auto_schema


def create_post(request, author, post_id=None):
    try:
        request_copy = request.data.copy() #so we don't modify the original request
        if request.method == 'PUT':
            post_ser = PostSerializer(data=request_copy, context={'post_id': post_id})
        else:
            post_ser = PostSerializer(data=request_copy)
        if post_ser.is_valid():
            post_ser.save(
                author = AuthorSerializer(author).data 
            )
            return Response(post_ser.data, status=status.HTTP_201_CREATED)
        else:
            return Response(post_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class PostList(APIView):
    @swagger_auto_schema(operation_description="Get all posts of an author", responses={200: PostSerializer(many=True)})
    def get(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        posts = author.posted.all() #get all posts of the authors
        
        page_number, size = request.GET.get('page'), request.GET.get('size')

        if page_number and size:
            paginator = Paginator(posts, size)
            try:
                posts = paginator.get_page(page_number).object_list
            except PageNotAnInteger:
                posts = paginator.get_page(1).object_list
            except EmptyPage:
                posts = paginator.get_page(paginator.num_pages).object_list
        
        serializer = PostSerializer(posts, many=True)
        return Response({"type":"posts","items":serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create a post for an author with a new ID", request_body = PostSerializer, responses={201: PostSerializer(), 400: "Bad request", 401: "type: error, message: Not authorized"}) 
    def post(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        if request.user.is_authenticated:# and request.user.id == author.customuser_id:
            return create_post(request, author)
        else:
            return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

class PostDetail(APIView):
    @swagger_auto_schema(operation_description="Get a post of an author", responses={200: PostSerializer()})
    def get(self, request, author_id, post_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create a post for an author with a specific ID", request_body = PostSerializer, responses={201: PostSerializer(), 400: "Bad request"})
    def put(self, request, author_id, post_id):
        author = get_object_or_404(Author, id=author_id)
        if Post.objects.filter(id=post_id).exists():
            return Response({"type": "error", "message": "Post already exists"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return create_post(request, author, post_id)

    @swagger_auto_schema(operation_description="Update a post of an author with the given ID", request_body = PostSerializer, responses={200: PostSerializer(), 400: "Bad request", 401: "type: error, message: Not authorized"})
    def post(self, request, author_id, post_id):
        if request.user.is_authenticated:
            author = get_object_or_404(Author, id=author_id)
            post = get_object_or_404(Post, id=post_id)
            # update the post whose id is pid
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

    @swagger_auto_schema(operation_description="Delete a post of an author with the given ID", responses={204: "No content"})       
    def delete(self, request, author_id, post_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentList(APIView):
    @swagger_auto_schema(operation_description="Get all comments of a post", responses={200: CommentSerializer(many=True)})
    def get(self, request, author_id, post_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        comments = post.comments.all().order_by('-published')

        page_number, size = request.GET.get('page'), request.GET.get('size')
        if page_number and size:
            paginator = Paginator(comments, size)
            try:
                comments = paginator.get_page(page_number).object_list
            except PageNotAnInteger:
                comments = paginator.get_page(1).object_list
            except EmptyPage:
                comments = paginator.get_page(paginator.num_pages).object_list
        
        serializer = CommentSerializer(comments, many=True)
        return Response({"type":"comments","id": post.url + "/comments","post": post.url, "url": post.url + "/comments", "comments":serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create a comment for a post", request_body = CommentSerializer, responses={201: CommentSerializer(), 400: "Bad request"})
    def post(self,request,author_id, post_id):
        original_author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        request_copy = request.data.copy()
        author_data = request_copy.get('author')
        new_author_id = author_data.get('id')
        if '/' in new_author_id:
            new_author_id = new_author_id.split('/')[-1]
        author = get_object_or_404(Author, id=new_author_id) #author who will comment on the current post - can be different than the original author
        
        request_copy['post'] = post_id 

        serializer = CommentSerializer(data=request_copy, context={'orig_auth_url': original_author.url})
        if serializer.is_valid():
            serializer.save(author=AuthorSerializer(author).data, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostLikes(APIView):
    @swagger_auto_schema(operation_description="Get all likes of a post", responses={200: LikeSerializer(many=True)})
    def get(self,request,author_id,post_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)

        likes = Like.objects.all().filter(object=post.url)
        if not likes:
            return Response({"type": "warning", "message": "No likes found"}, status=status.HTTP_204_NO_CONTENT)
        
        page_number, size = request.GET.get('page'), request.GET.get('size')
        if page_number and size:
            paginator = Paginator(likes, size)
            try:
                likes = paginator.get_page(page_number).object_list
            except PageNotAnInteger:
                likes = paginator.get_page(1).object_list
            except EmptyPage:
                likes = paginator.get_page(paginator.num_pages).object_list
        serializer = LikeSerializer(likes, many=True)
        return Response({"type":"likes","items":serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Like a post", request_body = LikeSerializer, responses={201: LikeSerializer(), 400: "Bad request"})
    def post(self, request, author_id, post_id):
        original_author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        request_copy = request.data.copy()
        author_data = request_copy.get('author')
        new_author_id = author_data.get('id')
        if '/' in new_author_id:
            new_author_id = new_author_id.split('/')[-1]
        author = get_object_or_404(Author, id=new_author_id) #author who will like the current post - can be different than the original author

        #check if author has already liked the post
        if Like.objects.filter(author=author, object=post.url).exists():
            return Response({"type": "error", "message": "You have already liked this post"}, status=status.HTTP_400_BAD_REQUEST)
        
        request_copy['object'] = f"{post.url}"
        request_copy['summary'] = f"{author.displayName} likes your post"
        request_copy['object_type'] = "post"

        serializer = LikeSerializer(data=request_copy)
        if serializer.is_valid():
            serializer.save(author=author)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentLikes(APIView):
    @swagger_auto_schema(operation_description="Get all likes of a comment", responses={200: LikeSerializer(many=True)})
    def get(self,request,author_id,post_id,comment_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        comment = get_object_or_404(Comment, id = comment_id)

        likes = Like.objects.all().filter(object=comment.url)
        if not likes:
            return Response({"type": "error", "message": "No likes found"}, status=status.HTTP_404_NOT_FOUND)
        
        page_number, size = request.GET.get('page'), request.GET.get('size')
        if page_number and size:
            paginator = Paginator(likes, size)
            try:
                likes = paginator.get_page(page_number).object_list
            except PageNotAnInteger:
                likes = paginator.get_page(1).object_list
            except EmptyPage:
                likes = paginator.get_page(paginator.num_pages).object_list

        serializer = LikeSerializer(likes, many=True)
        return Response({"type":"likes","items":serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Like a comment", request_body = LikeSerializer, responses={201: LikeSerializer(), 400: "Bad request"})
    def post(self, request, author_id, post_id,comment_id):
        original_author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        comment = get_object_or_404(Comment, id = comment_id)
        request_copy = request.data.copy()
        author_data = request_copy.get('author')
        new_author_id = author_data.get('id')
        if '/' in new_author_id:
            new_author_id = new_author_id.split('/')[-1]
        author = get_object_or_404(Author, id=new_author_id) #author who will like the current post - can be different than the original author

        #check if author has already liked the post
        if Like.objects.filter(author=author, object=comment.url).exists():
            return Response({"type": "error", "message": "You have already liked this comment"}, status=status.HTTP_400_BAD_REQUEST)
        
        request_copy['object'] = f"{comment.url}"
        request_copy['summary'] = f"{author.displayName} likes your comment"
        request_copy['object_type'] = "comment"

        serializer = LikeSerializer(data=request_copy)
        if serializer.is_valid():
            serializer.save(author=author)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AuthorLiked(APIView):
#     @swagger_auto_schema(operation_description="Get all posts liked by an author", responses={200: LikeSerializer(many=True)})
#     def get(self,request,author_id,post_id,comment_id):
#         author = get_object_or_404(Author, id=author_id)
#         post = get_object_or_404(Post, id=post_id)
#         author_liked = Like.objects.filter(author = author)
#         serializer = LikeSerializer(author_liked)
#         return Response( {"type": "liked", "items": serializer.data},status=status.HTTP_200_OK)

class ImageView(APIView):
    @swagger_auto_schema(operation_description="Get image of a post", responses={200: "image/png;base64", 400: "Bad request"})
    def get(self, request, author_id, post_id):
        author = get_object_or_404(Author, id=author_id)
        post = get_object_or_404(Post, id=post_id)
        
        if post.contentType == "image/png;base64" or post.contentType == "image/jpeg;base64" or post.contentType == "application/base64":
            return Response(base64.b64decode(post.content),status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

