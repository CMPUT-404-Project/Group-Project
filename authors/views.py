from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.urls import reverse

from .models import Author, FollowRequest
from .serializers import AuthorSerializer, FollowRequestSerializer
from django.contrib.auth.forms import UserCreationForm

from django.shortcuts import render, redirect
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

from django.contrib.auth.forms import AuthenticationForm
from .forms import AuthorSignupForm, UserLoginForm
from .models import Author, CustomUser

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema


from inbox.models import Inbox
import base64
import uuid
from urllib.parse import urlparse
from django.views import View
import requests 
from posts.models import Like
from posts.serializers import LikeSerializer
host_host = 'http://127.0.0.1:8000/service/authors/'

def create_new_author(id,data):
    return Author.objects.create(
        id = id,
        displayName=data['displayName'],
        host=data['host'],
        github=data['github'],
        url = data['url'],
    )

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        requestBody = request.POST.dict()
        # Check if the author already exists
        try:
            Author.objects.get(displayName=requestBody.get('username'))
            return JsonResponse({'success': False, 'error': 'Author already exists'})
        except Author.DoesNotExist: 
            # Create a new user
            user = CustomUser.objects.create_user(username=requestBody.get('username'), password=requestBody.get('password'))
            user.save() 
            # Create a new author
            author_data = requestBody.copy()
            author_data['displayName'] = requestBody.get('username')
            author_data['host'] = request.build_absolute_uri('/')
            author_data['id'] = str(uuid.uuid4().hex)
            author_data['url'] = f"{author_data['host']}service/authors/{author_data['id']}"
            author = Author.objects.create(
                customuser=user,
                id = author_data['id'],
                displayName=author_data['displayName'],
                host=author_data['host'],
                github=author_data['github'],
                url = author_data['url'],
            )
            author.save()
            return JsonResponse({'success': True, 'author_id': author.id})
    else:
        form = AuthorSignupForm()
        context = {'form': form}
        return render(request, 'signup.html', context=context)

@csrf_exempt
def user_login(request):
    if 'Authorization' in request.headers:
        # HTTP basic authentication
        auth = request.headers['Authorization'].split()
        if len(auth) == 2 and auth[0].lower() == 'basic':
            username, password = base64.b64decode(auth[1]).decode().split(':')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Authentication successful
                author_id = user.author.id
                author = Author.objects.get(id=author_id)
                if user.is_active:
                    login(request, user)
                    return JsonResponse({'success': True, 'author_id': author_id})
            else:
                # Authentication failed
                return JsonResponse({'success': False, 'message': 'Invalid username or password'})
    else:
        # Django/React-based authentication
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Authentication successful
                author_id = user.author.id
                author = Author.objects.get(id=author_id)
                if user.is_active:
                    login(request, user)
                    return JsonResponse({'success': True, 'author_id': author_id})
            else:
                # Authentication failed
                return JsonResponse({'success': False, 'message': 'Invalid username or password'})
        else:
            form = UserLoginForm()
            context = {'form': form}
            return render(request, 'login.html', context=context)
    
@method_decorator(csrf_exempt, name='dispatch')
class GithubActivity(APIView):
    @swagger_auto_schema(responses={200: 'Success', 404: 'Not Found'})
    def post(self, request):
        author_id = request.data.get('userID')
        author = get_object_or_404(Author, id=author_id)
        parsed = urlparse(author.github)
        path_parts = parsed.path.split('/')
        github_username = path_parts[1]

        if github_username:
            url = f'https://api.github.com/users/{github_username}/events/public'
            response = requests.get(url)
            data = response.json()
            return Response(data)
        else:
            return Response({'error': 'No GitHub username found'}, status=404)


class AuthorList(APIView):
    @swagger_auto_schema(operation_description="Get a list of all authors", responses={200: AuthorSerializer(many=True) , 400: 'Bad Request'})
    def get(self, request):
        query_set = Author.objects.all()
        
        page_number, size = request.GET.get('page'), request.GET.get('size')

        if page_number and size:
            paginator = Paginator(query_set, size)
            try:
                query_set = paginator.get_page(page_number).object_list
            except PageNotAnInteger:
                query_set = paginator.get_page(1).object_list
            except EmptyPage:
                query_set = paginator.get_page(paginator.num_pages).object_list
        
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "authors", "items": serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create a new author", request_body=AuthorSerializer, responses={200: "{'type': 'author', 'id': {id}}", 400: "{'type': 'error', 'message': {errors}}"})
    def post(self, request): 
        author_data = request.data
        serializer = AuthorSerializer(data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AuthorDetail(APIView):
    @swagger_auto_schema(operation_description="Get a specific author", responses={200: AuthorSerializer, 400: 'Bad Request'})
    def get(self, request, author_id):
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(author_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Update a specific author", request_body=AuthorSerializer, responses={200: "{'type': 'author', 'id': {id}}", 400: "{'type': 'error', 'message': {errors}}"})
    def put(self, request, author_id):
        request.user
        author_data = request.data
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(author_object, data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete a specific author", responses={200: "{'type': 'success', 'message': 'Author deleted'}", 400: 'Bad Request'})
    def delete(self, request, author_id):
        author_object = get_object_or_404(Author, id=author_id)
        author_object.delete()
        return Response({"type": "success", "message": "Author deleted"}, status=status.HTTP_200_OK)

def send_request(sender, receiver, requests):
    if requests:
        #already following
        if requests.filter(status=True):
            return Response({"type": "error", "message": f"{sender.displayName} is already following {receiver.displayName}"}, status=status.HTTP_400_BAD_REQUEST)
        #follow request already sent (pending)
        else:
            # If the request has been sent already, and they call the PUT again, turn it to true
            follow_request_approval = FollowRequest.objects.get(actor_id = sender.id , object_id = receiver.id)
            follow_request_approval.status = True
            follow_request_approval.save()
            return Response({"message": f"{sender.displayName} is following {receiver.displayName}"}, status=status.HTTP_200_OK)

    if sender.displayName == receiver.displayName:
        return Response({"type": "error", "message": "Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

    follow_request = {
        "id": uuid.uuid4().hex,
        "summary": f"{sender.displayName} wants to follow {receiver.displayName}",
        "type": "follow",
        "actor": sender.id,
        "object": receiver.id,
    }

    serializer = FollowRequestSerializer(data=follow_request)

    if serializer.is_valid():
        saved = serializer.save()
        #send request to receiver
        # followObject = FollowRequest.objects.get(pk=follow_request['id'])
        # inboxObject = Inbox(
        #     author=receiver,
        #     object=followObject,
        # )
        # inboxObject.save()

        return Response({"follow_request": serializer.data}, status=status.HTTP_200_OK)
    return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class FollowersList(APIView):
    @swagger_auto_schema(operation_description="Get a list of all followers", responses={200: AuthorSerializer(many=True) , 400: 'Bad Request'})
    def get(self, request, author_id):
        author_object = get_object_or_404(Author, id=author_id)
        query_set = FollowRequest.objects.all().filter(object = author_object.id, status=True).values_list('actor_id', flat=True) 
        followers = Author.objects.filter(id__in=query_set)

        page_number = request.GET.get('page', 1)
        size = request.GET.get('size', 10)

        if page_number and size:
            paginator = Paginator(followers, size)
            try:
                followers = paginator.page(page_number)
            except PageNotAnInteger:
                followers = paginator.page(1)
            except EmptyPage:
                followers = paginator.page(paginator.num_pages)
        data = AuthorSerializer(followers.object_list, many=True).data
        
        return Response({"type": "followers", "items": data}, status=status.HTTP_200_OK)

class FollowersDetail(APIView):
    @swagger_auto_schema(operation_description="Get a specific follower", responses={200: AuthorSerializer, 400: 'Bad Request'})
    def get(self, request, author_id, follower_id):
        follower_object = get_object_or_404(Author, id=follower_id)
        serializer = AuthorSerializer(follower_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Follow a specific author", responses={200: "{'follow_request': {follow_request}}", 400: "{'type': 'error', 'message': {errors}}", 401: "{'type': 'error', 'message': 'Not authenticated'}"})
    def put(self, request, author_id, follower_id):
        if request.user.is_authenticated:
            author_object = get_object_or_404(Author, id=author_id)
            follower_object = get_object_or_404(Author, id=follower_id)
            query_set = FollowRequest.objects.all().filter(actor_id = follower_object.id , object_id = author_object.id)     
            return send_request(follower_object, author_object, query_set)
        else:
            return Response({"type": "error", "message": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
                
    @swagger_auto_schema(operation_description="Unfollow a specific author", responses={200: "{'type': 'success', 'message': {message}}", 400: "{'type': 'error', 'message': {errors}}"})
    def delete(self, request, author_id, follower_id):
        author_object = get_object_or_404(Author, id=author_id)
        follower_object = get_object_or_404(Author, id=follower_id)
        follow_request = get_object_or_404(FollowRequest, actor = follower_object.id, object = author_object.id, status = True)
        follow_request.delete()
        return Response({"type": "success", "message": f"{follower_object.displayName} removed as a follower"}, status=status.HTTP_200_OK)

class SendFollowRequest(APIView):
    @swagger_auto_schema(operation_description="Send a follow request to a specific author", responses={200: "{'follow_request': {follow_request}}", 400: "{'type': 'error', 'message': {errors}}", 401: "{'type': 'error', 'message': 'Not logged in'}"})
    def get(self, request, author_id):
        if request.user.is_authenticated:
            author_object = get_object_or_404(Author, id=author_id)
            query_set = FollowRequest.objects.all().filter(actor = author_object.id)
            serializer = FollowRequestSerializer(query_set, many=True)
            return Response({"type": "followRequests", "items": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

    @swagger_auto_schema(operation_description="Send a follow request to an author", responses={200: "{'follow_request': {follow_request}}", 400: "{'type': 'error', 'message': {errors}}", 401: "{'type': 'error', 'message': 'Not logged in'}"})
    def post(self, request, author_id):
        if request.user.is_authenticated:
            sender = get_object_or_404(Author, id=author_id)

            #check if receiver exists
            author_data = request.data
            author_id = author_data['id']
            if '/' in author_id:
                author_id = author_id.split('/')[-1]
            if Author.objects.filter(id=author_id).exists():
                receiver = Author.objects.get(id=author_id)
            else:
                #create a new receiver and save it to the db
                receiver = create_new_author(author_id,author_data)
                receiver.save()

            receiver = get_object_or_404(Author, id=author_id)  
            current_requests = FollowRequest.objects.all().filter(actor_id = sender.id, object_id = receiver.id)
            return send_request(sender, receiver, current_requests)
        else:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        
class AuthorLiked(APIView):
    @swagger_auto_schema(operation_description="Get all posts liked by an author", responses={200: LikeSerializer(many=True)})
    def get(self, request, **kwargs):
        author_id = kwargs['author_id']
        author = get_object_or_404(Author, id=author_id)
        author_liked = Like.objects.filter(author=author)
        serializer = LikeSerializer(author_liked, many=True)
        return Response({"type": "liked", "items": serializer.data}, status=status.HTTP_200_OK)