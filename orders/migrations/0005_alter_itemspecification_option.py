# Generated by Django 4.1.2 on 2022-12-12 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0004_remove_catalogeditem_tax_exempt'),
        ('orders', '0004_rename_specifications_orderitem_specification_set'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemspecification',
            name='option',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='items.itemoption'),
        ),
    ]
