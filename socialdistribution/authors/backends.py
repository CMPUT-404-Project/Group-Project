from django.contrib.auth.backends import BaseBackend
from authors.models import Author
from django.utils import timezone

class AuthorBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            author = Author.objects.get(username=username)
            if author.check_password(password):
                author.last_login = timezone.now()  # update last_login on the Author model
                author.save(update_fields=['last_login'])  # save the updated Author object
                return author
        except Author.DoesNotExist:
            return None

    def get_user(self, username):
        try:
            return Author.objects.get(username=username)
        except Author.DoesNotExist:
            return None

    