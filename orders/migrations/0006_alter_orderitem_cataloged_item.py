# Generated by Django 4.1.2 on 2022-12-12 20:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0004_remove_catalogeditem_tax_exempt'),
        ('orders', '0005_alter_itemspecification_option'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='cataloged_item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='items.catalogeditem'),
        ),
    ]
