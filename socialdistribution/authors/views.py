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


from inbox.models import Inbox
import base64

import uuid
from urllib.parse import urlparse
from django.views import View
import requests 


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
            # serializer = AuthorSerializer(data=author_data)
            # if serializer.is_valid():
            #     saved = serializer.save()
            #     return JsonResponse({'success': True, 'author_id': saved.id})
            # else:
            #     return JsonResponse({'success': False, 'error': serializer.errors})
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
    
@method_decorator(csrf_exempt, name='dispatch')
class GithubActivity(APIView):
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
    def get(self, request):
        query_set = Author.objects.all()
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "authors", "items": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request): 
        author_data = request.data
        serializer = AuthorSerializer(data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AuthorDetail(APIView):
    def get(self, request, author_id):
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(author_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, author_id):
        request.user
        author_data = request.data
        author_object = get_object_or_404(Author, id=author_id)
        serializer = AuthorSerializer(author_object, data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({"type": "error", "message": "Follow Request Already Sent"}, status=status.HTTP_400_BAD_REQUEST)

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
        followObject = FollowRequest.objects.get(pk=follow_request['id'])
        inboxObject = Inbox(
            author=receiver,
            object=followObject,
        )
        inboxObject.save()

        return Response({"follow_request": serializer.data}, status=status.HTTP_200_OK)
    return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class FollowersList(APIView):
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
    
    def get(self, request, author_id, follower_id):
        follower_object = get_object_or_404(Author, id=follower_id)
        serializer = AuthorSerializer(follower_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, author_id, follower_id):
        if request.user.is_authenticated:
            author_object = get_object_or_404(Author, id=author_id)
            follower_object = get_object_or_404(Author, id=follower_id)
            query_set = FollowRequest.objects.all().filter(actor_id = follower_object.id , object_id = author_object.id)     
            return send_request(follower_object, author_object, query_set)
        else:
            return Response({"type": "error", "message": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
                

    def delete(self, request, author_id, follower_id):
        author_object = get_object_or_404(Author, id=author_id)
        follower_object = get_object_or_404(Author, id=follower_id)
        follow_request = get_object_or_404(FollowRequest, actor = follower_object.id, object = author_object.id, status = True)
        follow_request.delete()
        return Response({"type": "success", "message": f"{follower_object.displayName} removed as a follower"}, status=status.HTTP_200_OK)

class SendFollowRequest(APIView):
    def get(self, request, author_id):
        if request.user.is_authenticated:
            author_object = get_object_or_404(Author, id=author_id)
            query_set = FollowRequest.objects.all().filter(actor = author_object.id)
            serializer = FollowRequestSerializer(query_set, many=True)
            return Response({"type": "followRequests", "items": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, author_id):
        if request.user.is_authenticated:
            sender = get_object_or_404(Author, id=author_id)
            receiver = get_object_or_404(Author, displayName=request.data['displayName'])  
            current_requests = FollowRequest.objects.all().filter(actor_id = sender.id, object_id = receiver.id)
            return send_request(sender, receiver, current_requests)
        else:
            return Response({"type": "error", "message": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)