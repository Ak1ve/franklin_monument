# Generated by Django 4.1.2 on 2022-12-22 18:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('addressbook', '0001_initial'),
        ('orders', '0010_alter_overview_customer_contact'),
    ]

    operations = [
        migrations.AddField(
            model_name='overview',
            name='cemetery',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='addressbook.cemetery'),
        ),
    ]
