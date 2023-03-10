# Generated by Django 4.1.6 on 2023-03-13 02:13

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('type', models.CharField(default='Post', editable=False, max_length=20)),
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('content_type', models.CharField(choices=[('text/markdown', 'text/markdown'), ('text/plain', 'text/plain'), ('application/base64', 'application/base64'), ('image/png;base64', 'image/png;base64'), ('image/jpeg;base64', 'image/jpeg;base64'), ('multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')], default='text/plain', max_length=150)),
                ('content', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='post_images')),
                ('caption', models.CharField(blank=True, max_length=300, null=True)),
                ('count_likes', models.IntegerField(default=0)),
                ('published_time', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date published')),
                ('visibility', models.CharField(choices=[('PUBLIC', 'PUBLIC'), ('FRIENDS', 'FRIENDS')], default='PUBLIC', max_length=100)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posted', to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('type', models.CharField(default='Like', editable=False, max_length=200)),
                ('like_id', models.UUIDField(primary_key=True, serialize=False)),
                ('object_summary', models.URLField(editable=False, null=True)),
                ('summary_type', models.CharField(choices=[('post', 'post'), ('comment', 'comment')], max_length=250, null=True)),
                ('published_date', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date published')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('type', models.CharField(default='Comment', editable=False, max_length=200)),
                ('comment_id', models.UUIDField(primary_key=True, serialize=False)),
                ('content_type', models.CharField(choices=[('text/markdown', 'text/markdown'), ('text/plain', 'text/plain')], default='text/plain', max_length=150)),
                ('comment', models.TextField()),
                ('published_date', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date published')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authors.author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='posts.post')),
            ],
        ),
    ]
