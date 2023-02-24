from django.http import HttpResponse
from django.shortcuts import render
from .models import Author

# Create your views here.
def index(request):
    # obj = Author.objects.all()
    # context = {
    #     "obj":obj
    # }
    # return HttpResponse("Hello, world. You're at the home index.",context)
    return HttpResponse("Hello, world. You're at the home index.")
