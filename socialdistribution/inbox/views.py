from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Inbox
from .serializers import InboxSerializer

from authors.models import Author, CustomUser, FollowRequest
from authors.serializers import FollowRequestSerializer
from authors.views import create_new_author
from posts.models import Post,Comment,Like
from posts.views import create_post
from authors.serializers import AuthorSerializer
from posts.serializers import PostSerializer,CommentSerializer,LikeSerializer
from drf_yasg.utils import swagger_auto_schema

import uuid

#USER = CustomUser.objects.all()[0]

def get_author_id(url):
    url = url.split("/")
    return url[url.index('authors')+1]
def get_post_id(url):
    url = url.split("/")
    return url[url.index('posts')+1]
def get_comment_id(url):
    url = url.split("/")
    return url[url.index('comments')+1]

def get_inbox(data):
    inbox_data = None
    if data['type'] == 'post':

        #get post id
        post_id = data.pop('id')
        if not post_id: return Response({"type": "error", "message": "Post id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if '/' in post_id: post_id = get_post_id(post_id)

        #get author id
        author_id = data.get('author').get('id')
        if not author_id: return Response({"type": "error", "message": "Author id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if '/' in author_id: author_id = get_author_id(author_id)
           
        #if post exists then return it
        if Post.objects.filter(id=post_id).exists():
            inbox_data = Post.objects.get(id=post_id)
        #create a new post and return it
        else:
            try:
                #check if the author exists in our db
                author_data = data.pop('author')
                if Author.objects.filter(id=author_id).exists():
                    author = Author.objects.get(id=author_id)
                else:
                    #make a new author
                    author = create_new_author(author_id,author_data)
                    author.save()

                #create a new post
                post_ser = PostSerializer(data=data, context={'post_id': post_id})
                if post_ser.is_valid():
                    saved = post_ser.save(
                        author = AuthorSerializer(author).data, 
                    )
                else:
                    return Response({"type": "error", "message": "Error creating a new Post (ser)"}, status=status.HTTP_400_BAD_REQUEST)
                #get the post data
                post = Post.objects.get(id=saved.id)
                inbox_data = post
            except Exception as e:
                return Response({"type": "error", "message": "Error creating a new Post", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 

    elif data['type'] == 'Follow':
        actor_data = data.get('actor')
        object_data = data.get('object')

        if not actor_data: return Response({"type": "error", "message": "Actor not found"}, status=status.HTTP_400_BAD_REQUEST)
        if not object_data: return Response({"type": "error", "message": "Object not found"}, status=status.HTTP_400_BAD_REQUEST)

        #get actor id 
        actor_id = actor_data.get('id')
        if not actor_id: return Response({"type": "error", "message": "Actor id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if '/' in actor_id: actor_id = get_author_id(actor_id)

        #get object id
        object_id = object_data.get('id')
        if not object_id: return Response({"type": "error", "message": "Object id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if '/' in object_id: object_id = get_author_id(object_id)

        #if follow request exists
        if FollowRequest.objects.filter(actor_id=actor_id,object_id=object_id).exists():
            return Response({"type": "error", "message": "Follow request already exists"}, status=status.HTTP_400_BAD_REQUEST)
        #create a new follow request and return it
        else:
            try:
                #check if the object exist in our db
                if Author.objects.filter(id=object_id).exists():
                    object = Author.objects.get(id=object_id)   
                else:
                    return Response({"type": "error", "message": "Object (receiver) does not exist in our database"}, status=status.HTTP_400_BAD_REQUEST)

                if Author.objects.filter(id=actor_id).exists():
                    actor = Author.objects.get(id=actor_id)
                else:
                    #make a new author
                    actor = create_new_author(actor_id,actor_data)
                    actor.save()

                follow_request = {
                    "id": uuid.uuid4().hex,
                    'summary': data['summary'],
                    'actor': actor.id,
                    'object': object.id,
                }
                serializer = FollowRequestSerializer(data=follow_request)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response({"type": "error", "message": "Error creating a new Follow Request", "error": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
                inbox_data = FollowRequest.objects.get(pk=follow_request['id'])       
            except Exception as e:
                return Response({"type": "error", "message": "Error creating a new Follow Request", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # elif data['type'] == 'comment':
    #     return Comment.objects.get(id=data['id'])
        # try:
        #     author_data = data.get('author')
        #     #check if the author exists in our db
        #     if Author.objects.filter(id=author_data['id']).exists():
        #         author = Author.objects.get(id=author_data['id'])
        #     else:
        #         #make a new author
        #         author_ser = AuthorSerializer(data=author_data)
        #         if author_ser.is_valid():
        #             author_ser.save()
        #             author = Author.objects.get(id=author_ser.data['id'])
        #         else:
        #             return Response({"type": "error", "message": "Error creating a new Author"}, status=status.HTTP_400_BAD_REQUEST)

        #     url = data['id'].split('/')
        #     post_id = url[url.index('posts')+1]
        #     #check if the post exists in our db
        #     if Post.objects.filter(id=post_id).exists(): 
        #         post = Post.objects.get(id=post_id)   
        #     else:
        #         return Response({"type": "error", "message": "Post does not exist in the database"}, status=status.HTTP_400_BAD_REQUEST)
            
        # except:
        #     return Response({"type": "error", "message": "Error creating a new comment"}, status=status.HTTP_400_BAD_REQUEST)


    # elif data['type'] == 'like':
    #     return Like.objects.get(id=data['id'])

    return inbox_data


    

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
        response = get_inbox(request.data)
        if type(response) == Response:
            return response
        if response:
            inbox_object = Inbox.objects.create(author=author, object=response)
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
