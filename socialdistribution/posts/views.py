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
import uuid
from authors.serializers import AuthorSerializer
# Create your views here.


def create_post(request, author, pid=None):
    try:
        request_copy = request.data.copy() #so we don't modify the original request
        categories = request_copy.data.getlist('categories')
        request_copy['source'] = request.get_host() + request.path
        request_copy['origin'] = request.get_host() + request.path
        if request.method == 'PUT':
            request_copy['id'] = pid

        post_ser = PostSerializer(data=request_copy)
        if post_ser.is_valid():
            post_ser.save(
                author = AuthorSerializer(author).data, 
                categories = categories
            )
            return Response(post_ser.data, status=status.HTTP_201_CREATED)
        else:
            return Response(post_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class PostList(APIView):
    
    def get(self, request, id):
        author = get_object_or_404(Author, id=id)
        posts = author.post_set.all() #get all posts of the authors

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
    
    def post(self, request, id):
        author = get_object_or_404(Author, id=id)
        if request.user.is_authenticated and request.user.id == author.user.id:
            return create_post(request, author)
        else:
            return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

class PostDetail(APIView):
    def get(self, request, id, pid):
        post = get_object_or_404(Post, id=pid)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, pid):
        author = get_object_or_404(Author, id=id)
        if Post.objects.filter(id=pid).exists():
            return Response({"type": "error", "message": "Post already exists"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return create_post(request, author, pid)

    def post(self, request, id, pid):
        if request.user.is_authenticated:
            author = get_object_or_404(Author, id=id)
            post = get_object_or_404(Post, id=pid)
            # update the post whose id is pid
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"type": "error", "message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
    def delete(self, request, id, pid):
        author = get_object_or_404(Author, id=id)
        post = get_object_or_404(Post, id=pid)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

class LikesDetail(APIView):
    def get(self,request,author_id,post_id):
        if request.user.is_authenticated:
            # author_object = get_object_or_404(Author, id=author_id)
            # post_object = get_object_or_404(Post,id=post_id)
            likes = Like.objects.filter(post = post_id)
            serializer = LikeSerializer(likes, many=True)
            
            return Response({"type": "like", "items": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            
    def post(self, request, author_id, post_id):
        # like_data = request.data
        # like_data['post'] = post_id
        # serializer = LikeSerializer(data = like_data)
        # if serializer.is_valid():
        #     saved = serializer.save()
        #     return Response({"type": "like", "id": saved.id}, status=status.HTTP_201_CREATED)
        # else:
        #     print('Error', serializer.errors)
        #     return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        request_dict = dict(request.data)
        try:
            author_like = Author.objects.get(url=request_dict['author'])   
        except:
            return Response({"message": "Author not found"}, status=status.HTTP_404_NOT_FOUND)
        
        request_dict["author"] = AuthorSerializer(data=author_like).data
        serializer = LikeSerializer(data = request_dict)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "like", "id": saved.id}, status=status.HTTP_201_CREATED)
        else:
            print('Error', serializer.errors)
            return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
# class LikeList(APIView):
#     def get(self, request, id):
#         Like_object = get_object_or_404(Like, id=id)
#         query_set = Like.objects.filter(author=Like_object)
#         serializer = LikeSerializer(query_set, many=True)
#         return Response({"type": "like", "items": serializer.data}, status=status.HTTP_200_OK)
    
#     def post(self, request, author_id, post_id):
#         post_data = request.data
#         post_data['author'] = author_id
#         post_data['post'] = post_id
#         serializer = LikeSerializer(data = post_data)
#         if serializer.is_valid():
#             saved = serializer.save()
#             return Response({"type": "post", "id": saved.id}, status=status.HTTP_201_CREATED)
#         else:
#             print('Error', serializer.errors)
#             return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class LikeDetail(APIView):
#     def get(self, request, id):
#         like_object = get_object_or_404(Like, id=id)
#         serializer = LikeSerializer(like_object, many=False)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request, id):
#         like_data = request.data
#         like_object = get_object_or_404(Comment, id=id)
#         serializer = CommentSerializer(like_object, data=like_data)
#         if serializer.is_valid():
#             saved = serializer.save()
#             return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
#         return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, id):
#         author_object = get_object_or_404(Comment, id=id)
#         author_object.delete()
#         return Response({"type": "success", "message": "Like deleted"}, status=status.HTTP_200_OK)
    
