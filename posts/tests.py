from django.test import TestCase
from django.test import TestCase, Client
from rest_framework import status
from rest_framework.test import APIClient
from authors.models import Author, CustomUser
from authors.serializers import AuthorSerializer
from rest_framework.test import APITestCase
import uuid

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
# Create your tests here.

HOST = 'https://example.com/'
AUTH_PREF = 'service/authors/'

class PostTestCase(APITestCase):

    def setUp(self):
        self.custom_user1 = CustomUser.objects.create_user(
            username='testuser1', 
            password='testpassword1'
        )

        id1 = uuid.uuid4().hex
        self.author1 = Author.objects.create(
            customuser=self.custom_user1,
            id=id1,
            host=HOST,
            displayName='Test Author 1',
            url=f'{HOST}{AUTH_PREF}{id1}',
            github='https://github.com/test_user1/',
            profileImage=f'{HOST}image.jpg'
        )


        # Create a post
        self.post1 = Post.objects.create(
            title='Test Post 1',
            author=self.author1,
            description = 'Test Description 1',
            categories = ['Test Category 1', 'Test Category 2'],
            content='Test Content 1',
            visibility='PUBLIC'
        )

    def test_post_creation(self):
        post = Post.objects.get(id=self.post1.id)
        self.assertEqual(post.title, 'Test Post 1')
        self.assertEqual(post.author, self.author1)
        self.assertEqual(post.description, 'Test Description 1')
        self.assertEqual(post.categories, ['Test Category 1', 'Test Category 2'])
        self.assertEqual(post.content, 'Test Content 1')
        self.assertEqual(post.visibility, 'PUBLIC')
    
    def test_post_serializer(self):
        post = Post.objects.get(id=self.post1.id)
        serializer = PostSerializer(post)
        self.assertEqual(serializer.data['title'], 'Test Post 1')
        self.assertEqual(serializer.data['author']['id'], self.author1.url)
        self.assertEqual(serializer.data['description'], 'Test Description 1')
        self.assertEqual(serializer.data['categories'], ['Test Category 1', 'Test Category 2'])
        self.assertEqual(serializer.data['content'], 'Test Content 1')
        self.assertEqual(serializer.data['visibility'], 'PUBLIC')
    
    def test_post_serializer_create_delete(self):
        data = {
            'title': 'Test Post 2',
            'description': 'Test Description 2',
            'categories': ['Test Category 3', 'Test Category 4'],
            'content': 'Test Content 2',
            'visibility': 'PUBLIC'
        }
        serializer = PostSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save(
            author = AuthorSerializer(self.author1).data,
        )
        post = Post.objects.get(title='Test Post 2')
        self.assertEqual(post.title, 'Test Post 2')
        self.assertEqual(post.author, self.author1)
        self.assertEqual(post.description, 'Test Description 2')
        self.assertEqual(post.categories, ['Test Category 3', 'Test Category 4'])
        self.assertEqual(post.content, 'Test Content 2')
        self.assertEqual(post.visibility, 'PUBLIC')

        post.delete()
        self.assertEqual(Post.objects.filter(title='Test Post 2').count(), 0)
    

    #test endpoints
    def test_post_list(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'posts')
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['title'], 'Test Post 1')
        self.assertEqual(response.data['items'][0]['author']['id'], self.author1.url)
        self.assertEqual(response.data['items'][0]['description'], 'Test Description 1')
        self.assertEqual(response.data['items'][0]['categories'], ['Test Category 1', 'Test Category 2'])
        self.assertEqual(response.data['items'][0]['content'], 'Test Content 1')
        self.assertEqual(response.data['items'][0]['visibility'], 'PUBLIC')

    
    def test_post_create(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        data = {
            'title': 'Test Post 2',
            'description': 'Test Description 2',
            'categories': ['Test Category 3', 'Test Category 4'],
            'content': 'Test Content 2',
            'visibility': 'PUBLIC'
        }
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test Post 2')
        self.assertEqual(response.data['author']['id'], self.author1.url)
        self.assertEqual(response.data['description'], 'Test Description 2')
        self.assertEqual(response.data['categories'], ['Test Category 3', 'Test Category 4'])
        self.assertEqual(response.data['content'], 'Test Content 2')
        self.assertEqual(response.data['visibility'], 'PUBLIC')

        post = Post.objects.get(title='Test Post 2')
        post.delete()
        self.assertEqual(Post.objects.filter(title='Test Post 2').count(), 0)


    def test_post_retrieve(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post 1')
        self.assertEqual(response.data['author']['id'], self.author1.url)
        self.assertEqual(response.data['description'], 'Test Description 1')
        self.assertEqual(response.data['categories'], ['Test Category 1', 'Test Category 2'])
        self.assertEqual(response.data['content'], 'Test Content 1')
        self.assertEqual(response.data['visibility'], 'PUBLIC')


    def test_post_update(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        data = {
            'title': 'Test Post 1 Updated',
        }
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post 1 Updated')
        self.assertEqual(response.data['author']['id'], self.author1.url)
        self.assertEqual(response.data['description'], 'Test Description 1')
        self.assertEqual(response.data['categories'], ['Test Category 1', 'Test Category 2'])
        self.assertEqual(response.data['content'], 'Test Content 1')
        self.assertEqual(response.data['visibility'], 'PUBLIC')


    def test_post_delete(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.delete(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.filter(id=self.post1.id).count(), 0)


    def tearDown(self):
        self.custom_user1.delete()
        self.author1.delete()
        self.post1.delete()


class CommentTest(APITestCase):

    def setUp(self):
        self.custom_user1 = CustomUser.objects.create_user(
            username='testuser1', 
            password='testpassword1'
        )

        id1 = uuid.uuid4().hex
        self.author1 = Author.objects.create(
            customuser=self.custom_user1,
            id=id1,
            host=HOST,
            displayName='Test Author 1',
            url=f'{HOST}{AUTH_PREF}{id1}',
            github='https://github.com/test_user1/',
            profileImage=f'{HOST}image.jpg'
        )


        # Create a post
        self.post1 = Post.objects.create(
            title='Test Post 1',
            author=self.author1,
            description = 'Test Description 1',
            categories = ['Test Category 1', 'Test Category 2'],
            content='Test Content 1',
            visibility='PUBLIC'
        )

        # Create a comment
        self.comment1 = Comment.objects.create(
            author=self.author1,
            post=self.post1,
            comment='Test Comment 1',
            contentType='text/plain'
        )

    def test_comment_creation(self):
        comment = Comment.objects.get(comment='Test Comment 1')
        self.assertEqual(comment.author, self.author1)
        self.assertEqual(comment.post, self.post1)
        self.assertEqual(comment.comment, 'Test Comment 1')
        self.assertEqual(comment.contentType, 'text/plain')

    
    def test_comment_serializer(self):
        comment = Comment.objects.get(comment='Test Comment 1')
        serializer = CommentSerializer(comment)
        self.assertEqual(serializer.data['author']['id'], self.author1.url)
        self.assertEqual(serializer.data['comment'], 'Test Comment 1')
        self.assertEqual(serializer.data['contentType'], 'text/plain')

    
    #test endpoints
    def test_comment_list(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}/comments')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'comments')
        self.assertEqual(len(response.data['comments']), 1)
        self.assertEqual(response.data['comments'][0]['author']['id'], self.author1.url)
        self.assertEqual(response.data['comments'][0]['comment'], 'Test Comment 1')
        self.assertEqual(response.data['comments'][0]['contentType'], 'text/plain')

    
    def test_comment_create(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        data = {
            'author': AuthorSerializer(self.author1).data,
            'comment': 'Test Comment 2',
            'contentType': 'text/plain'
        }
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}/comments', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['type'], 'comment')
        self.assertEqual(response.data['author']['id'], self.author1.url)
        self.assertEqual(response.data['comment'], 'Test Comment 2')
        self.assertEqual(response.data['contentType'], 'text/plain')

        comment = Comment.objects.get(comment='Test Comment 2')
        comment.delete()
        self.assertEqual(Comment.objects.filter(comment='Test Comment 2').count(), 0)


    def tearDown(self):
        self.custom_user1.delete()
        self.author1.delete()
        self.post1.delete()
        self.comment1.delete()

    
class PostLikeTest(APITestCase):
    def setUp(self):
        self.custom_user1 = CustomUser.objects.create_user(
            username='testuser1', 
            password='testpassword1'
        )
        
        self.custom_user2 = CustomUser.objects.create_user(
            username='testuser2',
            password='testpassword2'
        )

        id1 = uuid.uuid4().hex
        self.author1 = Author.objects.create(
            customuser=self.custom_user1,
            id=id1,
            host=HOST,
            displayName='Test Author 1',
            url=f'{HOST}{AUTH_PREF}{id1}',
            github='https://github.com/test_user1/',
            profileImage=f'{HOST}image.jpg'
        )

        id2 = uuid.uuid4().hex
        self.author2 = Author.objects.create(
            customuser=self.custom_user2,
            id=id2,
            host=HOST,
            displayName='Test Author 2',
            url=f'{HOST}{AUTH_PREF}{id2}',
            github='https://github.com/test_user2/',
            profileImage=f'{HOST}image.jpg'

        )


        # Create a post
        id = uuid.uuid4().hex
        self.post1 = Post.objects.create(
            id=id,
            url = f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{id}',
            title='Test Post 1',
            author=self.author1,
            description = 'Test Description 1',
            categories = ['Test Category 1', 'Test Category 2'],
            content='Test Content 1',
            visibility='PUBLIC'
        )

        # create a post like using serializer
        data = {
            "id": uuid.uuid4().hex,
            'object': self.post1.url,
            'summary': f'{self.author1.displayName} likes your post'
        }
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=self.author1)


    def test_post_like_creation(self):
        post_like = Like.objects.get(author=self.author1, object=self.post1.url)
        self.assertEqual(post_like.author, self.author1)
        self.assertEqual(post_like.object, self.post1.url)
        self.assertEqual(post_like.object_type, 'post')

    
    def test_post_like_serializer(self):
        post_like = Like.objects.get(author=self.author1, object=self.post1.url)
        serializer = LikeSerializer(post_like)
        self.assertEqual(serializer.data['author']['id'], self.author1.url)
        self.assertEqual(serializer.data['object'], self.post1.url)
        self.assertEqual(serializer.data['object_type'], 'post')

    #test endpoints
    def test_post_like_list(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}/likes')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'likes')
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['author']['id'], self.author1.url)
        self.assertEqual(response.data['items'][0]['object'], self.post1.url)
        self.assertEqual(response.data['items'][0]['object_type'], 'post')

    def test_post_like_create_already_liked(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        data = {
            'author': AuthorSerializer(self.author1).data,
            'object': self.post1.url,
            'object_type': 'post'
        }
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}/likes', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_post_like_create_new(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user2)
        data = {
            'author': AuthorSerializer(self.author2).data,
            'object': self.post1.url,
            'object_type': 'post'
        }
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{self.post1.id}/likes', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['author']['id'], self.author2.url)
        self.assertEqual(response.data['object'], self.post1.url)
        self.assertEqual(response.data['object_type'], 'post')

        post_like = Like.objects.get(author=self.author2, object=self.post1.url)
        post_like.delete()
        self.assertEqual(Like.objects.filter(author=self.author2, object=self.post1.url).count(), 0)


class CommentLikeTest(APITestCase):
    def setUp(self):
        self.custom_user1 = CustomUser.objects.create_user(
            username='testuser1', 
            password='testpassword1'
        )
        
        self.custom_user2 = CustomUser.objects.create_user(
            username='testuser2',
            password='testpassword2'
        )

        id1 = uuid.uuid4().hex
        self.author1 = Author.objects.create(
            customuser=self.custom_user1,
            id=id1,
            host=HOST,
            displayName='Test Author 1',
            url=f'{HOST}{AUTH_PREF}{id1}',
            github='https://github.com/test_user1/',
            profileImage=f'{HOST}image.jpg'
        )

        id2 = uuid.uuid4().hex
        self.author2 = Author.objects.create(
            customuser=self.custom_user2,
            id=id2,
            host=HOST,
            displayName='Test Author 2',
            url=f'{HOST}{AUTH_PREF}{id2}',
            github='https://github.com/test_user2/',
            profileImage=f'{HOST}image.jpg'

        )


        # Create a post
        id = uuid.uuid4().hex
        self.post1 = Post.objects.create(
            id=id,
            url = f'{HOST}{AUTH_PREF}{self.author1.id}/posts/{id}',
            title='Test Post 1',
            author=self.author1,
            description = 'Test Description 1',
            categories = ['Test Category 1', 'Test Category 2'],
            content='Test Content 1',
            visibility='PUBLIC'
        )

        # Create a comment using the serializer
        data = {
            'post': self.post1.url,
            'author': AuthorSerializer(self.author1).data,
            'comment': 'Test Comment 1',
            'contentType': 'text/plain',
        }
        serializer = CommentSerializer(data=data, context={'orig_auth_url': self.author1.url})
        if serializer.is_valid():
            serializer.save(
                author=AuthorSerializer(self.author1).data,
                post=self.post1
            )
        
        self.comment1 = Comment.objects.get(post=self.post1, author=self.author1)

        # Create a like using the serializer
        data = {
            'id': uuid.uuid4().hex,
            'object': self.comment1.url,
            'object_type': 'comment',
            'summary': f'{self.author1.displayName} likes your comment'
        }
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save(
                author=self.author1,
            )

    
    def test_comment_like_creation(self):
        comment_like = Like.objects.get(author=self.author1, object=self.comment1.url)
        self.assertEqual(comment_like.author, self.author1)
        self.assertEqual(comment_like.object, self.comment1.url)
        self.assertEqual(comment_like.object_type, 'comment')

        
    def test_comment_like_serializer(self):
        comment_like = Like.objects.get(author=self.author1, object=self.comment1.url)
        serializer = LikeSerializer(comment_like)
        self.assertEqual(serializer.data['author']['id'], self.author1.url)
        self.assertEqual(serializer.data['object'], self.comment1.url)
        self.assertEqual(serializer.data['object_type'], 'comment')
    

    #test endpoints
    def test_comment_like_list(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{self.comment1.url}/likes')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'likes')
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['author']['id'], self.author1.url)
        self.assertEqual(response.data['items'][0]['object'], self.comment1.url)
        self.assertEqual(response.data['items'][0]['object_type'], 'comment')
    
    def test_comment_like_create_existing(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user1)
        data = {
            'author': AuthorSerializer(self.author1).data,
            'object': self.comment1.url,
            'object_type': 'comment'
        }
        response = self.client.post(f'{self.comment1.url}/likes', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_comment_like_create_new(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.custom_user2)
        data = {
            'author': AuthorSerializer(self.author2).data,
            'object': self.comment1.url,
            'object_type': 'comment'
        }
        response = self.client.post(f'{self.comment1.url}/likes', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['author']['id'], self.author2.url)
        self.assertEqual(response.data['object'], self.comment1.url)
        self.assertEqual(response.data['object_type'], 'comment')

        comment_like = Like.objects.get(author=self.author2, object=self.comment1.url)
        comment_like.delete()
        self.assertEqual(Like.objects.filter(author=self.author2, object=self.comment1.url).count(), 0)