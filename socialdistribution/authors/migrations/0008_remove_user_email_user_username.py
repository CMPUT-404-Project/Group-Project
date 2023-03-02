# Generated by Django 4.1.6 on 2023-03-02 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authors', '0007_remove_user_displayname_remove_user_github_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='email',
        ),
        migrations.AddField(
            model_name='user',
            name='username',
            field=models.CharField(default='none', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
