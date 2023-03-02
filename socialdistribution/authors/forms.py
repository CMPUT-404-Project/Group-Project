from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Author
from .models import User

class AuthorSignupForm(UserCreationForm):
    host = forms.CharField(max_length=200)
    displayName = forms.CharField(max_length=200)
    url = forms.CharField(max_length=200)
    github = forms.CharField(max_length=200)

    class Meta:
        model = User
        fields = ['email', 'password1', 'password2', 'host', 'displayName', 'url', 'github']

    def save(self, commit=True):
        user = super(AuthorSignupForm, self).save(commit=False)
        user.host = self.cleaned_data['host']
        user.displayName = self.cleaned_data['displayName']
        user.url = self.cleaned_data['url']
        user.github = self.cleaned_data['github']
        if commit:
            user.save()
            author = Author.objects.create(user=user, host=user.host,
            displayName=user.displayName,
            url=user.url,
            github=user.github)
            
        return author


        
