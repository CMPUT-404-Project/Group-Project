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
# Create your views here.

from django.contrib.auth.forms import AuthenticationForm
from .forms import AuthorSignupForm, UserLoginForm
from .models import Author, CustomUser

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import uuid


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        requestBody = request.POST.dict()
        print(requestBody)
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
            author_data['id'] = uuid.uuid4().hex
            author_data['url'] = f"{author_data['host']}author/{author_data['id']}"
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
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
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

class AuthorList(APIView):
    def get(self, request):
        query_set = Author.objects.all()
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "authors", "items": serializer.data}, status=status.HTTP_200_OK)

    # I do not think we need post
    def post(self, request): #Do we need post?
        author_data = request.data
        serializer = AuthorSerializer(data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AuthorDetail(APIView):
    def get(self, request, id):
        author_object = get_object_or_404(Author, id=id)
        serializer = AuthorSerializer(author_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        author_data = request.data
        author_object = get_object_or_404(Author, id=id)
        serializer = AuthorSerializer(author_object, data=author_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        author_object = get_object_or_404(Author, id=id)
        author_object.delete()
        return Response({"type": "success", "message": "Author deleted"}, status=status.HTTP_200_OK)


class FollowersList(APIView):
    def get(self, request, id):
        author_object = get_object_or_404(Author, id=id)
        query_set = Followers.objects.filter(author=author_object)
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "followers", "items": serializer.data}, status=status.HTTP_200_OK)

class FollowersDetail(APIView):
    def get(self, request, id, fid):
        author_object = get_object_or_404(Author, id=id)
        follower_object = get_object_or_404(Author, id=fid)
        query_set = Followers.objects.filter(author=author_object, followers=follower_object)
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "follower", "items": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, id, fid):
        author_object = get_object_or_404(Author, id=id)
        follower_object = get_object_or_404(Author, id=fid)
        query_set = Followers.objects.filter(author=author_object, followers=follower_object)
        if query_set:
            return Response({"type": "error", "message": "Already following"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            new_follower = Followers(author=author_object, followers=follower_object)
            new_follower.save()
            return Response({"type": "success", "message": "Followed"}, status=status.HTTP_200_OK)

    def delete(self, request, id, fid):
        author_object = get_object_or_404(Author, id=id)
        follower_object = get_object_or_404(Author, id=fid)
        query_set = Followers.objects.filter(author=author_object, followers=follower_object)
        if query_set:
            query_set.delete()
            return Response({"type": "success", "message": "Unfollowed"}, status=status.HTTP_200_OK)
        else:
            return Response({"type": "error", "message": "Not following"}, status=status.HTTP_400_BAD_REQUEST)