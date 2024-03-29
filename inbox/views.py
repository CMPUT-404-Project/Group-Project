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

def get_inbox(receiving_author, data): #receiving_author is the author who is receiving the inbox item
    inbox_data = None
    if data['type'].lower() == 'post':

        #get post id
        post_id = data.get('id')
        if not post_id: 
            return Response({"type": "error", "message": "Post id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in post_id) and ('posts' in post_id): 
            post_id = get_post_id(post_id)
        else: 
            return Response({"type": "error", "message": "Invalid post ID format"}, status=status.HTTP_400_BAD_REQUEST)
        data.pop('id')

        #get author id
        sending_author_id = data.get('author').get('id')
        if not sending_author_id: 
            return Response({"type": "error", "message": "Author id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in sending_author_id) and ('authors' in sending_author_id): 
            sending_author_id = get_author_id(sending_author_id)
        else: 
            return Response({"type": "error", "message": "Invalid author ID format"}, status=status.HTTP_400_BAD_REQUEST)
        data.pop('author') 

        #if post exists then return it
        if Post.objects.filter(id=post_id).exists():
            inbox_data = Post.objects.get(id=post_id)
        #create a new post and return it
        else:
            try:
                #check to see if the receiving author is following the sending author - only then can the receiving author accept the post
                if FollowRequest.objects.filter(actor_id=receiving_author.id, object_id=sending_author_id).exists():
                    follow_request = FollowRequest.objects.get(actor_id=receiving_author.id, object_id=sending_author_id)
                    if follow_request.status == True:
                        sending_author = Author.objects.get(id=sending_author_id)
                    else:
                        return Response({"type": "error", "message": "receiving post denied as sending author hasn't accepted the follow request from the receiving author"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"type": "error", "message": "receiving post denied as receiving author is not following the sending author"}, status=status.HTTP_400_BAD_REQUEST)

                #create a new post
                post_ser = PostSerializer(data=data, context={'post_id': post_id})
                if post_ser.is_valid():
                    saved = post_ser.save(
                        author = AuthorSerializer(sending_author).data, 
                    )
                else:
                    return Response({"type": "error", "message": "Error creating a new Post (ser)"}, status=status.HTTP_400_BAD_REQUEST)
                #get the post data
                post = Post.objects.get(id=saved.id)
                inbox_data = post
            except Exception as e:
                return Response({"type": "error", "message": "Error creating a new Post", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 

    elif data['type'].lower() == 'follow':
        actor_data = data.get('actor')
        object_data = data.get('object')

        if not actor_data: 
            return Response({"type": "error", "message": "Actor not found"}, status=status.HTTP_400_BAD_REQUEST)
        if not object_data: 
            return Response({"type": "error", "message": "Object not found"}, status=status.HTTP_400_BAD_REQUEST)

        #get actor id 
        actor_id = actor_data.get('id')
        if not actor_id: 
            return Response({"type": "error", "message": "Actor id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in actor_id) and ('authors' in actor_id): 
            actor_id = get_author_id(actor_id)
        else: 
            return Response({"type": "error", "message": "Invalid actor ID format"}, status=status.HTTP_400_BAD_REQUEST)

        #get object id
        object_id = object_data.get('id')
        if not object_id: 
            return Response({"type": "error", "message": "Object id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in object_id) and ('authors' in object_id): 
            object_id = get_author_id(object_id)
        else: 
            return Response({"type": "error", "message": "Invalid object ID format"}, status=status.HTTP_400_BAD_REQUEST)

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

    elif data['type'].lower() == 'comment':
        #get comment, post and post author id
        id_url = data.get('id')
        if not id_url: 
            return Response({"type": "error", "message": "Comment id not found"}, status=status.HTTP_400_BAD_REQUEST)
        data.pop('id')

        if ('/' in id_url) and ('posts' in id_url) and ('comments' in id_url) and ('authors' in id_url): 
            comment_id = get_comment_id(id_url)
            post_id = get_post_id(id_url)
            #post_auth_id = get_author_id(id_url)
        else:
            return Response({"type": "error", "message": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)

        #get author id - one who's commenting
        author_id = data.get('author').get('id')
        if not author_id: 
            return Response({"type": "error", "message": "Author id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in author_id) and ('authors' in author_id): 
            author_id = get_author_id(author_id)
        else: 
            return Response({"type": "error", "message": "Invalid author ID format"}, status=status.HTTP_400_BAD_REQUEST)

        #if post author does not exist
        # if not Author.objects.filter(id=post_auth_id).exists():
        #    return Response({"type": "error", "message": "Author of the post does not exist in our database"}, status=status.HTTP_400_BAD_REQUEST)
        
        #if post does not exist
        if not Post.objects.filter(id=post_id).exists():
            return Response({"type": "error", "message": "Post does not exist in our database"}, status=status.HTTP_400_BAD_REQUEST)
        
        #if comment exists
        if Comment.objects.filter(id=comment_id).exists():
            inbox_data = Comment.objects.get(id=comment_id)
            #return Response({"type": "error", "message": "Comment with same ID (UUID) already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            #create a new comment and return it
            try:
                #get the post
                post = Post.objects.get(id=post_id)
                data['post'] = post_id

                #check if the author exists in our db
                author_data = data.pop('author')
                if Author.objects.filter(id=author_id).exists():
                    author = Author.objects.get(id=author_id)
                else:
                    #if the post is public then create a new author
                    if post.visibility == 'PUBLIC':
                        author = create_new_author(author_id,author_data)
                        author.save()
                    else:
                        return Response({"type": "error", "message": "There's no relationship between the sending author and receiving author (none of them follow the other one)"}, status=status.HTTP_400_BAD_REQUEST)
                    #make a new author
                    #author = create_new_author(author_id,author_data)
                    #author.save()

                #create a new comment
                comment_ser = CommentSerializer(data=data, context={'comment_id': comment_id, 'comment_url': id_url})
                if comment_ser.is_valid():
                    saved = comment_ser.save(
                        author = AuthorSerializer(author).data, 
                        post = post,
                    )
                else:
                    return Response({"type": "error", "message": "Error creating a new Comment (ser)"}, status=status.HTTP_400_BAD_REQUEST)
                #get the comment data
                comment = Comment.objects.get(id=saved.id)
                inbox_data = comment
            except Exception as e:
                return Response({"type": "error", "message": "Error creating a new Comment", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    elif data['type'].lower() == 'like':
        # get the like object data
        author_data = data.get('author')
        object_url = data.get('object')
        
        # check if required fields are present
        if not author_data or not object_url:
            return Response({"type": "error", "message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # get author id
        author_id = author_data.get('id')
        if not author_id: return Response({"type": "error", "message": "Author id not found"}, status=status.HTTP_400_BAD_REQUEST)
        if ('/' in author_id) and ('authors' in author_id):     
            author_id = get_author_id(author_id)
        else: 
            return Response({"type": "error", "message": "Invalid author ID format"}, status=status.HTTP_400_BAD_REQUEST)
        

        try:

             # object_url checks
            if ('/' in object_url) and ('posts' in object_url) and ('authors' in object_url): 
                post_id = get_post_id(object_url)
                #post_auth_id = get_author_id(object_url)
            else:
                return Response({"type": "error", "message": "Invalid object url format"}, status=status.HTTP_400_BAD_REQUEST)

            ## check if author and post exist
            
            #if post author does not exist
            #if not Author.objects.filter(id=post_auth_id).exists():
            #    return Response({"type": "error", "message": "Author of the post does not exist in our database"}, status=status.HTTP_400_BAD_REQUEST)
            
            #if post does not exist
            if not Post.objects.filter(id=post_id).exists():
                return Response({"type": "error", "message": "Post does not exist in our database"}, status=status.HTTP_400_BAD_REQUEST)

            post = Post.objects.get(id=post_id)

            # check if the author exists in our db
            if Author.objects.filter(id=author_id).exists():
                author = Author.objects.get(id=author_id)
            else:
                # if the post is public then create a new author
                if post.visibility == 'PUBLIC':
                    author = create_new_author(author_id, author_data)
                    author.save()
                else:
                    return Response({"type": "error", "message": "There's no relationship between the sending author and receiving author (none of them follow the other one)"}, status=status.HTTP_400_BAD_REQUEST)
                # make a new author
                # author = create_new_author(author_id, author_data)
                # author.save()
      
            
            if 'comment' in object_url:
                # do checks for comment like

                # check if the comment exists in our db
                comment_id = get_comment_id(object_url)
                if Comment.objects.filter(id=comment_id).exists():
                    comment = Comment.objects.get(id=comment_id)
                    type = 'comment'
                else:
                    return Response({"type": "error", "message": "Comment does not exist in the database"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # handle post
                type = 'post'


            # check if the like already exists
            if Like.objects.filter(object=object_url, author=author).exists():
                inbox_data = Like.objects.get(object=object_url, author=author)

            else:
                # create a new like object
                like = {
                    "id": uuid.uuid4().hex,
                    "summary": f"{author.displayName} likes your {type}",
                    "object": object_url,
                    "object_type": type
                }
                like_ser = LikeSerializer(data=like)

                if like_ser.is_valid():
                    #saved = like_ser.save(author=AuthorSerializer(author).data)
                    saved = like_ser.save(author=author)
                else:
                    return Response({"type": "error", "message": "Error creating a new Like (ser)"}, status=status.HTTP_400_BAD_REQUEST)

                # get the like object data
                like = Like.objects.get(id=saved.id)
                inbox_data = like
        
        except Exception as e:
            return Response({"type": "error", "message": "Error creating a new Like", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        if not request.user.is_authenticated:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        inbox_object = Inbox.objects.filter(author=author)
        inbox_data = [ser_inbox_items(item) for item in inbox_object]
        return Response({"type": "inbox", "author": author.url, "items":inbox_data}, status=status.HTTP_200_OK)
    

    @swagger_auto_schema(operation_description="Add inbox of the current author", responses={200: "type: success, message: Inbox added", 400: "type: error, message: Error adding inbox"})
    def post(self, request, author_id):
        author = get_object_or_404(Author, id=author_id)
        response = get_inbox(author, request.data)
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
        if not request.user.is_authenticated:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)
       
        
        inbox_object = Inbox.objects.all().filter(author=author)
        inbox_object.delete()
        return Response({"type": "success", "message": "Inbox deleted"}, status=status.HTTP_200_OK)
