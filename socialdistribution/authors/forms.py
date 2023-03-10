from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Author
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class AuthorSignupForm(UserCreationForm):
    host = forms.CharField(max_length=200)
    displayName = forms.CharField(max_length=200)
    url = forms.CharField(max_length=200)
    github = forms.CharField(max_length=200)

    class Meta:
        model = CustomUser
        fields = ['username', 'password1', 'password2', 'host', 'displayName', 'url', 'github']

    def save(self, commit=True):
        user = super(AuthorSignupForm, self).save(commit=False)
        host_data = self.cleaned_data['host']
        displayName_data = self.cleaned_data['displayName']
        url_data = self.cleaned_data['url']
        github_data = self.cleaned_data['github']
        if commit:
            user.save()
            author = Author.objects.create(customuser=user, host=host_data, displayName=displayName_data,url=url_data,github=github_data)
        author.save() 
        return author

class UserLoginForm(AuthenticationForm):
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password']


        
