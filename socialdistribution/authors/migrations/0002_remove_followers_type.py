# Generated by Django 4.1.6 on 2023-02-26 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authors', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='followers',
            name='type',
        ),
    ]
