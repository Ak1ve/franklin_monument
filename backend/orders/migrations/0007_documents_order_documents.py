# Generated by Django 4.1.2 on 2023-04-16 16:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0002_rename_file_documentfile'),
        ('orders', '0006_alter_memorialplacement_face_stone'),
    ]

    operations = [
        migrations.CreateModel(
            name='Documents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notes', models.TextField()),
                ('files', models.ManyToManyField(to='document.documentfile')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='documents',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='orders.documents'),
        ),
    ]
