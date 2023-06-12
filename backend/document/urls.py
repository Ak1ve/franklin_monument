from django.urls import path
from django.core.files.base import ContentFile

from . import views

urlpatterns = [
    path("<int:file_id>", views.redirect),
    path("<int:file_id>/<str:name>", views.load_document)
]
