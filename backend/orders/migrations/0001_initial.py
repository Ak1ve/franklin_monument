# Generated by Django 4.1.2 on 2023-03-27 13:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('addressbook', '0001_initial'),
        ('document', '0001_initial'),
        ('contactable', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('items', '0007_catalogeditem_is_deleted'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeliveryMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method_name', models.CharField(max_length=128)),
                ('is_deleted', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='DesignProofs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notes', models.TextField()),
                ('files', models.ManyToManyField(to='document.file')),
            ],
        ),
        migrations.CreateModel(
            name='ItemSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ItemSpecificationSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='OrderType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_name', models.CharField(max_length=128)),
                ('is_deleted', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Vector3',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('length', models.FloatField()),
                ('width', models.FloatField()),
                ('height', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Overview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deceased_name', models.CharField(blank=True, max_length=512)),
                ('promise_date', models.DateField(blank=True)),
                ('tax_exempt', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True)),
                ('cemetery', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='addressbook.cemetery')),
                ('customer_contact', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='contactable.contact')),
                ('delivery_method', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='orders.deliverymethod')),
                ('order_type', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='orders.ordertype')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, max_digits=20)),
                ('notes', models.TextField()),
                ('tax_exempt', models.BooleanField()),
                ('cataloged_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='items.catalogeditem')),
                ('dimensions', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='orders.vector3')),
                ('item_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.itemset')),
                ('specification_set', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='orders.itemspecificationset')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Cancelled', 'Cancelled'), ('Active', 'Active'), ('Production Hold', 'Production Hold'), ('Ready To Invoice', 'Ready To Invoice'), ('Invoiced', 'Invoiced'), ('Paid', 'Paid')], default='Active', max_length=16)),
                ('order_created', models.DateTimeField(auto_now_add=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('item_set', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='orders.itemset')),
                ('overview', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='orders.overview')),
                ('proofs', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='orders.designproofs')),
            ],
        ),
        migrations.CreateModel(
            name='ItemSpecification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='items.itemoption')),
                ('specification_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='specifications', to='orders.itemspecificationset')),
                ('values', models.ManyToManyField(to='items.itemoptionvalue')),
            ],
        ),
    ]