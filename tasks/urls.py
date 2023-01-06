from django.urls import path

from . import views

urlpatterns = [
    path("", views.task_home),
    path("<int:item_id>", views.task_edit)
]
