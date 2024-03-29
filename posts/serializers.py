from rest_framework import serializers
from .models import Post, Comment, Like
from authors.serializers import AuthorSerializer
from authors.models import Author

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(many = False, read_only=True, required=False)
    id = serializers.CharField(source="get_url", read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
    
    def create(self, validated_data):
        author_data = validated_data.pop('author')
        author_id = author_data.get('id')
        if '/' in author_id:
            author_id = author_id.split('/')[-1]
        author = Author.objects.get(id=author_id)
        if 'post_id' in self.context:
            validated_data['id'] = self.context['post_id']
        post = Post.objects.create(**validated_data, author=author)
        post.url = f"{author.url}/posts/{post.id}"
        post.save()
        return post

    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        comments = Comment.objects.filter(post=instance)
        ret['count'] = len(comments)
        ret['comments'] = f"{ret['url']}/comments"

        likes = Like.objects.filter(object=instance)
        ret['likes'] = LikeSerializer(likes, many=True).data
        return ret


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="get_url", read_only=True)
    author = AuthorSerializer(read_only=True)
    class Meta:
        model = Comment
        exclude = ['post']  
    
    def create(self, validated_data):
        author_data = validated_data.pop('author')
        author_id = author_data.get('id')
        if '/' in author_id:
            author_id = author_id.split('/')[-1]
        author = Author.objects.get(id=author_id)
        if 'comment_id' in self.context:
            validated_data['id'] = self.context['comment_id']
        comment = Comment.objects.create(**validated_data, author=author)
        if 'orig_auth_url' in self.context:
            comment.url = f"{self.context['orig_auth_url']}/posts/{comment.post.id}/comments/{comment.id}"
        elif 'comment_url' in self.context:
            comment.url = f"{self.context['comment_url']}"
        comment.save()
        return comment
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['author'] = AuthorSerializer(instance.author).data
        return ret


class LikeSerializer(serializers.ModelSerializer):
    # author = AuthorSerializer(required=False)
    author = AuthorSerializer(read_only=True)
    class Meta:
        model = Like
        fields = '__all__' #maybe exclude object_type?
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['author'] = AuthorSerializer(instance.author).data
        return ret