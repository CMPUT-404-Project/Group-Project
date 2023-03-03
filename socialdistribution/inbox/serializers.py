from rest_framework import serializers
from .models import Inbox

class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = ['type', 'id', 'object_type', 'published_date']