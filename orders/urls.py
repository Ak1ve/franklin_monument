from django.urls import path

from . import views

urlpatterns = [
    path("", views.orders_home),
    path("new", views.order_new),
    path("<int:order_id>", views.order_view),
    path("item/<int:item_id>", views.order_item_send),
    path("<int:order_id>/item", views.order_item_view),
    path("<int:order_id>/item/<int:item_id>", views.order_item_view)
]
