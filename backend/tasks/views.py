from django.shortcuts import render, HttpResponse
from django.http import HttpResponseServerError
from items.models import CatalogedItem
# Create your views here.

from . import models


def task_home(request):
    """
    GET: get task home
    :param request:
    :return:
    """
    return render(request, "task_home.html", {"items": CatalogedItem.objects.filter(is_deleted=False)})


def task_edit(request, item_id: int):
    """
    POST: edit task list of a model must be models.ItemTaskResponse
    :param request:
    :param item_id:
    :return:
    """
    if request.method != "POST":
        return HttpResponseServerError(b"{'err': 'Invalid method.  Must be POST'}")
    if not request.user.is_superuser:
        return HttpResponseServerError(b"{'err': 'Not Authenticated'}")

    response = models.ItemTasksResponse.from_json(request.body)
    item: CatalogedItem = CatalogedItem.objects.get(id=item_id)
    tasks = models.ItemTasks.new_from_response(response)
    item.tasks = tasks
    item.save()

    return HttpResponse(b"{}")