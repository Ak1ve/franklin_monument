# Generated by Django 4.1.2 on 2023-03-27 14:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
        ('document', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='File',
            new_name='DocumentFile',
        ),
    ]