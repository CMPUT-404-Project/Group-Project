from rest_framework import serializers
from .models import Author, FollowRequest

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="get_url", read_only=True)
    class Meta:
        model = Author
        fields = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profile_image']

class FollowRequestSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(many=False, required=False)

    class Meta:
        model = FollowRequest
        fields = '__all__'
    
    def create(self, validated_data):
        id = validated_data.pop('id')
        foll_req = FollowRequest.objects.create(**validated_data, id=id)
        foll_req.save()
        return foll_req
    
    def to_representation(self, instance):
        representation = super(FollowRequestSerializer, self).to_representation(instance)
        representation['actor'] = AuthorSerializer(instance.actor).data
        representation['object'] = AuthorSerializer(instance.object).data
        return representation