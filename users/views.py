from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User

import json

from . import models
from items.models import CatalogedItem

# Create your views here.


def users_associated_with_task(task: models.Task) -> list[User]:
    users = []
    for user in User.objects.all():
        if task.id in (t.id for t in user.listened_tasks.tasks.all()):
            users.append(user)
    return users


def auto_assign_tasks(request, cataloged_item_id: int):
    """

    Pseudo Code
    go through every task in the CatalogedItem
    see if the tasks is each User's listener
    assign the task to whoever has the fewest task in that category


    :param request:
    :param cataloged_item_id:
    :return:
    """
    item = CatalogedItem.objects.get(id=cataloged_item_id)
    send = models.AutoAssignTaskSend([])
    for task in item.tasks.tasks.all():
        allowed_users = users_associated_with_task(task)
        if not len(allowed_users):
            continue
        counter = {user.id: len(models.UserTask.objects.filter(user=user, task=task, completed_on=None)) for user
                   in allowed_users}
        send.tasks.append(models.UserAssignedTask(task_id=task.id, user_id=min(counter, key=counter.get)))
    return JsonResponse(send.to_json(), safe=False)


def listen_view(request, user_id: int):
    user = User.objects.get(id=user_id)
    if models.TaskListener.objects.filter(user=user).first() is None:
        l = models.TaskListener(user=user)
        l.save()
    if request.method == "GET":
        items = CatalogedItem.objects.filter(is_deleted=False)
        return render(request, "users_task_listener.html", {"cataloged_items": items, "user": user})
    elif request.method == "POST" and request.user.is_superuser:
        resp = json.loads(request.body)
        user.listened_tasks.tasks.set(models.Task.objects.filter(id__in=resp))
        return JsonResponse({})


def home_view(request):
    return render(request, "users_home.html", {"users": User.objects.all()})
