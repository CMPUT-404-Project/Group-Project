# Generated by Django 4.1.6 on 2023-03-03 06:07

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('type', models.CharField(default='inbox', editable=False, max_length=200)),
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('object_type', models.CharField(choices=[('post', 'post'), ('comment', 'comment'), ('like', 'like'), ('follow', 'follow')], max_length=250, null=True)),
                ('published_date', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date published')),
            ],
        ),
    ]
