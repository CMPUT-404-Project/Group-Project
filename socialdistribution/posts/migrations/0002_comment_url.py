# Generated by Django 4.1.6 on 2023-03-23 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='url',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
