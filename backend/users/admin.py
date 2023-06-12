from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.UserTask)
admin.site.register(models.TaskListener)
admin.site.register(models.UserTaskComment)