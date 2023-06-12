from django.urls import path

from . import views

urlpatterns = [
    path("assign/<int:cataloged_item_id>", views.auto_assign_tasks),
    path("listen/<int:user_id>", views.listen_view),
    path("", views.home_view)
]
