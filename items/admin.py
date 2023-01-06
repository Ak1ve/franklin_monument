from django.contrib import admin


from . import models

# Register your models here.


admin.site.register(models.ItemOption)
admin.site.register(models.CatalogedItem)
admin.site.register(models.ItemOptionValue)