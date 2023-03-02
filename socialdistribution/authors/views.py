from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Author, Followers, FollowRequest
from .serializers import AuthorSerializer, FollowRequestSerializer
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.shortcuts import render, redirect
# Create your views here.

from django.contrib import messages

from django.shortcuts import render, redirect
from .forms import AuthorSignupForm
from .models import Author

def signup(request):
    if request.method == 'POST':
        form = AuthorSignupForm(request.POST)
        if form.is_valid():
            form.save()
            print(form.cleaned_data)
            return redirect('list')
    else:
        form = AuthorSignupForm()
    return render(request, 'signup.html', {'form': form})


from django.contrib.auth import authenticate, login

from .forms import UserLoginForm

def user_login(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Authentication successful
                login(request, user)
                #author = user.author
                # Do something with the author instance
                return redirect('list')
            else:
                # Authentication failed
                return render(request, 'login.html', {'form': form, 'error': 'Invalid email or password'})
    else:
        # Display login form
        form = UserLoginForm()
    return render(request, 'login.html', {'form': form})

class AuthorList(APIView):
    def get(self, request):
        query_set = Author.objects.all()
        serializer = AuthorSerializer(query_set, many=True)
        return Response({"type": "authors", "items": serializer.data}, status=status.HTTP_200_OK)

    #I do not think we need post
    # def post(self, request): #Do we need post?
    #     author_data = request.data
    #     serializer = AuthorSerializer(data=author_data)
    #     if serializer.is_valid():
    #         saved = serializer.save()
    #         return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
    #     return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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