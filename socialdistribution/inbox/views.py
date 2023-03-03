from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Inbox
from .serializers import InboxSerializer
# Create your views here.

class InboxDetail(APIView):
    def get(self, request, id):
        Inbox_object = get_object_or_404(Inbox, id=id)
        serializer = InboxSerializer(Inbox_object, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        Inbox_data = request.data
        post_object = get_object_or_404(Inbox, id=id)
        serializer = InboxSerializer(post_object, data=Inbox_data)
        if serializer.is_valid():
            saved = serializer.save()
            return Response({"type": "author", "id": saved.id}, status=status.HTTP_200_OK)
        return Response({"type": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        Inbox_object = get_object_or_404(Inbox, id=id)
        Inbox_object.delete()
        return Response({"type": "success", "message": "Post deleted"}, status=status.HTTP_200_OK)
