# Generated by Django 4.1.2 on 2022-11-18 13:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
        ('items', '0002_remove_itemoptionvalue_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='catalogeditem',
            name='tasks',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.itemtasks'),
        ),
    ]
