from django.urls import path

from . import views

urlpatterns = [
    path("", views.item_home),
    path("<int:item_id>", views.item_view),
    path("new", views.item_new),
    path("option/add", views.item_option),
    path("option/<int:option_id>", views.item_option_id),
]
