# Generated by Django 4.1.6 on 2023-03-23 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_alter_comment_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='object',
            field=models.URLField(null=True),
        ),
    ]