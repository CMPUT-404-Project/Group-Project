# Generated by Django 4.1.7 on 2023-02-26 17:51

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
		('user', models.OneToOneField(User, on_delete=models.CASCADE, related_name='author', default=None)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(default='author', editable=False, max_length=20)),
                ('host', models.CharField(max_length=200)),
                ('displayName', models.CharField(max_length=200)),
                ('url', models.CharField(max_length=200)),
                ('github', models.CharField(max_length=200)),
                ('profile_image', models.ImageField(default='blank_profile.png', null=True, upload_to='profile_images')),
            ],
        ),
        migrations.CreateModel(
            name='FollowRequest',
            fields=[
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('summary', models.CharField(max_length=200)),
                ('type', models.CharField(default='Follow', editable=False, max_length=20)),
                ('status', models.BooleanField(default=False)),
                ('request_time', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date request came')),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actor', to='authors.author')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='object', to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Followers',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('author', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='author', to='authors.author')),
                ('followers', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='followers', to='authors.author')),
            ],
        ),
    ]
