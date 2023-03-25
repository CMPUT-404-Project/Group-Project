from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Author
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class AuthorSignupForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    github = forms.CharField(max_length=200)


class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)

        
