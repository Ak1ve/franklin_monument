from django.urls import path

from . import views

urlpatterns = [
    path("", views.orders_home),
    path("new", views.order_new),
    path("<int:order_id>", views.order_view),
    path("item/<int:item_id>", views.order_item_send),
    path("<int:order_id>/item", views.order_item_view),
    path("<int:order_id>/item/<int:item_id>", views.order_item_view),
    path("<int:order_id>/overview", views.order_overview),
    path("tasks/comment", views.user_comment_view),
    path("tasks/comment/<int:user_comment_id>", views.user_comment_view),
    path("tasks/<int:task_id>", views.user_task_view),
    path("tasks/start/<int:task_id>", views.user_task_start),
    path("tasks/complete/<int:task_id>", views.user_task_complete),
    path("tasks/status/<int:task_id>", views.task_status),
    path("<int:order_id>/proofs/upload", views.proofs_upload),
    path("<int:order_id>/proofs", views.proofs_edit)
]
