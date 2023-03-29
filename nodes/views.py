from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from drf_yasg.utils import swagger_auto_schema

from .models import Node
from .serializers import NodeSerializer

# Create your views here.
class NodeView(APIView):
    @swagger_auto_schema(operation_description="Get a list of all the teams we are connected to", responses={ 200: NodeSerializer(many=True)})
    def get(self, request):
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response({'type': 'Nodes', 'nodes': serializer.data})
    
    @swagger_auto_schema(operation_description="Add a new team as our connection", request_body=NodeSerializer, responses={ 201: NodeSerializer, 400: "Bad Request"})
    def post(self, request):
        serializer = NodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
