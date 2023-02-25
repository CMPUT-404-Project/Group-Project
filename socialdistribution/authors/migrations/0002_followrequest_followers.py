# Generated by Django 4.1.6 on 2023-02-25 11:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FollowRequest',
            fields=[
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('summary', models.CharField(max_length=200)),
                ('type', models.CharField(default='Follow', editable=False, max_length=20)),
                ('status', models.BooleanField(default=False)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actor', to='authors.author')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='object', to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Followers',
            fields=[
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='author', to='authors.author')),
                ('followers', models.ManyToManyField(related_name='followers', to='authors.author')),
            ],
        ),
    ]
