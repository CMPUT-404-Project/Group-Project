# Generated by Django 4.1.6 on 2023-03-23 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authors', '0003_alter_author_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='profile_image',
            field=models.ImageField(default='blank_profile.png', null=True, upload_to='profile_images'),
        ),
    ]