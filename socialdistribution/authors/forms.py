from django import forms
from .models import Author

class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = ['username', 'password', 'displayName', 'url', 'github']
        widgets = {
            'password': forms.PasswordInput()
        }

class LoginForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(max_length=128, widget=forms.PasswordInput())
