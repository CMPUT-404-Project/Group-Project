from django.test import TestCase
from django.test import TestCase, Client
from rest_framework import status
from rest_framework.test import APIClient
from authors.models import Author, CustomUser, FollowRequest
from authors.serializers import AuthorSerializer, FollowRequestSerializer
from rest_framework.test import APITestCase
import uuid

client = APIClient()
HOST = 'https://example.com/'
AUTH_PREF = 'service/authors/'


''' Author Model Tests ''' 
class AuthorTests(TestCase):

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
        self.serializer1 = AuthorSerializer(self.author1)
        self.serializer2 = AuthorSerializer(self.author2)

    #Test the author model
    def test_author_creation(self):
        self.assertEqual(self.author1.displayName, 'Test Author 1')
        self.assertEqual(self.author1.host, HOST)
        self.assertEqual(self.author1.url, f'{HOST}{AUTH_PREF}{self.author1.id}')
        self.assertEqual(self.author1.github, 'https://github.com/test_user1/')
        self.assertEqual(self.author1.profileImage, f'{HOST}image.jpg')
    

    def test_id_is_not_none(self):
        self.assertIsNotNone(self.author1.id)

    def test_ids_are_unique(self):
        self.assertNotEqual(self.author1.id, self.author2.id)

    def test_str_representation(self):
        self.assertEqual(str(self.author1), f'Test Author 1-{self.author1.id}')

    
    #Test Author Serializer
    def test_author_fields(self):
        data = self.serializer1.data
        self.assertEqual(set(data.keys()), set(['type', 'id', 'url', 'host', 'displayName', 'github', 'profileImage']))

    def test_author_fields_values(self):
        data = self.serializer1.data
        self.assertEqual(data['type'], 'author')
        self.assertEqual(data['id'], f'{self.author1.url}')
        self.assertEqual(data['url'], f'{HOST}{AUTH_PREF}{self.author1.id}')
        self.assertEqual(data['host'], HOST)
        self.assertEqual(data['displayName'], 'Test Author 1')
        self.assertEqual(data['github'], 'https://github.com/test_user1/')
        self.assertEqual(data['profileImage'], f'{HOST}image.jpg')


    #Test endpoints
    #Test the get endpoint for all authors
    def test_get_all_authors(self):
        response = client.get('/service/authors')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'authors')
        self.assertEqual(len(response.data['items']), 2)

    #Test the post endpoint
    def test_post_author(self):
        id = uuid.uuid4().hex
        response = client.post('/service/authors', {
            'id': id,
            'host': HOST,
            'displayName': 'Test Author 3',
            'url': f'{HOST}{AUTH_PREF}{id}',
            'github': 'https://github.com/test_user1/',
            'profileImage': f'{HOST}image.jpg'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'author')
        self.assertIsNotNone(response.data['id'])    
    
    #Test the get endpoint for a specific author
    def test_get_specific_author(self):
        response = client.get(f'/service/authors/{self.author1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'author')
        self.assertEqual(response.data['id'], f'{self.author1.url}')
        self.assertEqual(response.data['url'], f'{HOST}{AUTH_PREF}{self.author1.id}')
        self.assertEqual(response.data['host'], HOST)
        self.assertEqual(response.data['displayName'], 'Test Author 1')
        self.assertEqual(response.data['github'], 'https://github.com/test_user1/')
        self.assertEqual(response.data['profileImage'], f'{HOST}image.jpg')

    #Test the put endpoint for a specific author
    def test_put_specific_author(self):
        response = client.put(f'/service/authors/{self.author1.id}', {
            'id': self.author1.id,
            'host': HOST,
            'displayName': 'Test Author 5',
            'url': f'{HOST}{AUTH_PREF}{self.author1.id}',
            'github': 'https://github.com/test_user1_1/',
            'profileImage': f'{HOST}image_new.jpg'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = client.get(f'/service/authors/{self.author1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'author')
        self.assertEqual(response.data['id'], f'{self.author1.url}')
        self.assertEqual(response.data['url'], f'{HOST}{AUTH_PREF}{self.author1.id}')
        self.assertEqual(response.data['host'], HOST)
        self.assertEqual(response.data['displayName'], 'Test Author 5')
        self.assertEqual(response.data['github'], 'https://github.com/test_user1_1/')
        self.assertEqual(response.data['profileImage'], f'{HOST}image_new.jpg')


    #Test the delete endpoint for a specific author
    def test_delete_specific_author(self):
        response = client.delete(f'/service/authors/{self.author1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def tearDown(self):
        self.author1.delete()
        self.author2.delete()
        self.custom_user1.delete()
        self.custom_user2.delete()

''' FollowRequest Model Tests'''
class FollowRequestTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

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

        self.follow_request1 = FollowRequest.objects.create(
            id = uuid.uuid4().hex,
            summary=f'{self.author1.displayName} wants to follow {self.author2.displayName}',
            actor=self.author1,
            object=self.author2
        )

        self.serializer1 = FollowRequestSerializer(instance=self.follow_request1)

    #Test the model
    def test_follow_request_model(self):
        self.assertEqual(self.follow_request1.type, 'Follow')
        self.assertEqual(self.follow_request1.summary, f'{self.author1.displayName} wants to follow {self.author2.displayName}')
        self.assertEqual(self.follow_request1.actor, self.author1)
        self.assertEqual(self.follow_request1.object, self.author2)
        self.assertEqual(self.follow_request1.status, False)

    def test_id_is_not_null(self):
        self.assertIsNotNone(self.follow_request1.id)
    
    #Test the serializer
    def test_follow_request_serializer(self):
        data = self.serializer1.data
        self.assertEqual(data['type'], 'Follow')
        self.assertEqual(data['summary'], f'{self.author1.displayName} wants to follow {self.author2.displayName}')
        self.assertEqual(data['actor']['id'], self.author1.url)
        self.assertEqual(data['object']['id'], self.author2.url)
        self.assertEqual(data['status'], False)
       
    #Test the get endpoint (unauthorized)
    def test_get_follow_request_unauthorized(self):
        response = client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/sendrequest/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        expected_data = {
            "type": "error",
            "message": "Not logged in"
        }
        self.assertEqual(response.data, expected_data)

    #Test the get endpoint (authorized)
    def test_get_follow_request_authorized(self):
        self.client.force_authenticate(user=self.custom_user1)
        response = self.client.get(f'{HOST}{AUTH_PREF}{self.author1.id}/sendrequest/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'followRequests')
        items = response.data['items']
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['type'], 'Follow')
        self.assertEqual(items[0]['summary'], f'{self.author1.displayName} wants to follow {self.author2.displayName}')
        self.assertEqual(items[0]['actor']['id'], self.author1.url)
        self.assertEqual(items[0]['object']['id'], self.author2.url)
        self.assertEqual(items[0]['status'], False)
    
    #Test the post endpoint (unauthorized)
    def test_post_follow_request_unauthorized(self):
        response = client.post(f'{HOST}{AUTH_PREF}{self.author1.id}/sendrequest/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        expected_data = {
            "type": "error",
            "message": "Not logged in"
        }
        self.assertEqual(response.data, expected_data)
    
    #Test the post endpoint (authorized)
    def test_post_follow_request_authorized(self):
        self.client.force_authenticate(user=self.custom_user1)

        #make author 2 follow author 1
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author2.id}/sendrequest/', AuthorSerializer(self.author1).data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data), 1)
        response_data = response.data['follow_request']
        self.assertEqual(response_data['type'], 'Follow')
        self.assertEqual(response_data['summary'], f'{self.author2.displayName} wants to follow {self.author1.displayName}')
        self.assertEqual(response_data['actor']['id'], self.author2.url)
        self.assertEqual(response_data['object']['id'], self.author1.url)
        self.assertEqual(response_data['status'], False)

    def test_post_status_change(self):
        self.client.force_authenticate(user=self.custom_user1)

        #make author 2 follow author 1
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author2.id}/sendrequest/', AuthorSerializer(self.author1).data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        #make author 2 follow author 1 again
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author2.id}/sendrequest/', AuthorSerializer(self.author1).data, format='json')
        
        expected_response = {
            "message": f"{self.author2.displayName} is following {self.author1.displayName}"
        }
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_response)

        #make author 2 follow author 1 again
        response = self.client.post(f'{HOST}{AUTH_PREF}{self.author2.id}/sendrequest/', AuthorSerializer(self.author1).data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def tearDown(self):
        self.custom_user1.delete()
        self.custom_user2.delete()
        self.author1.delete()
        self.author2.delete()
        self.follow_request1.delete()