from rest_framework import serializers
from .models import Post, Comment, Like
from authors.serializers import AuthorSerializer
from authors.models import Author

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(many = False, read_only=True, required=False)
    categories = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Post
        fields = '__all__'
        depth  = 2
    
    def create(self, validated_data):
        author = Author.objects.get(id=validated_data['author'].id)
        categories = validated_data.pop('categories')
        post = Post.objects.create(**validated_data, author=author)
        for category in categories:
            post.categories.add(category)
        post.save()
        return post

    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        comments = Comment.objects.filter(post=instance)
        likes = Like.objects.filter(post=instance)
        ret['comments'] = CommentSerializer(comments, many=True).data
        ret['likes'] = LikeSerializer(likes, many=True).data
        return ret


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(required=False)
    class Meta:
        model = Comment
        exclude = ['post']
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['author'] = AuthorSerializer(instance.author).data
        return ret


class LikeSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(required=False)
    class Meta:
        model = Like
        fields = '__all__' #maybe exclude object_type?
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['author'] = AuthorSerializer(instance.author).data
        return ret