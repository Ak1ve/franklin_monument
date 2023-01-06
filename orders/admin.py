from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.Vector3)
admin.site.register(models.Order)
admin.site.register(models.OrderItem)
admin.site.register(models.ItemSpecification)
admin.site.register(models.ItemSpecificationSet)
admin.site.register(models.ItemSet)
admin.site.register(models.Overview)
admin.site.register(models.DeliveryMethod)
admin.site.register(models.OrderType)