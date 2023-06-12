from django.urls import path

from . import views

urlpatterns = [
    path("", views.address_home),
    path("<int:address_id>", views.address_view),
    path("new", views.address_view)
]
