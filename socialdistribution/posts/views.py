from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    # obj = Author.objects.all()
    # context = {
    #     "obj":obj
    # }
    # return HttpResponse("Hello, world. You're at the home index.",context)
    return HttpResponse("Hello, world. You're at the posts index.")
