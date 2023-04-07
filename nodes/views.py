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
    

class NodeDetailView(APIView):
    @swagger_auto_schema(operation_description="Get the details of a team we are connected to", responses={ 200: NodeSerializer, 404: "Not Found"})
    def get(self, request, team_num):
        node = get_object_or_404(Node, team_num=team_num)
        serializer = NodeSerializer(node)
        return Response({'type': 'Node', 'node': serializer.data})
    
    @swagger_auto_schema(operation_description="Update the details of a team we are connected to", request_body=NodeSerializer, responses={ 200: NodeSerializer, 400: "Bad Request"})
    def put(self, request, team_num):
        node = get_object_or_404(Node, team_num=team_num)
        serializer = NodeSerializer(node, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, team_num):
        node = get_object_or_404(Node, team_num=team_num)
        serializer = NodeSerializer(node, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(operation_description="Delete a team we are connected to", responses={ 204: "No Content", 404: "Not Found"})
    def delete(self, request, team_num):
        node = get_object_or_404(Node, team_num=team_num)
        node.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
            
    
