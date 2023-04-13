from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User

import json

from django.utils import timezone

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
    # TODO when readjusting the tasks, all tasks get deleted.  Associated tasks are deleted
    for task in item.tasks.tasks.all():
        allowed_users = users_associated_with_task(task)
        if not len(allowed_users):
            continue
        counter = {user.id: len(models.UserTask.objects.filter(user=user, task=task)) for user
                   in allowed_users}
        send.tasks.append(models.UserAssignedTask(task_id=task.id, user_id=min(counter, key=counter.get)))
    return JsonResponse(send.to_json(), safe=False)


def start_task(task_id) -> models.UserTask:
    """
    this marks a task object as "Started" and will be displayed on a User's
    task list
    :param task_id:
    :return: task that was started
    """

    task: models.UserTask = models.UserTask.objects.get(id=task_id)
    task.started_on = timezone.now()
    task.save()
    return task


def complete_task(task_id) -> tuple[models.UserTask, models.UserTask | None]:
    """
    Marks the current task as complete and marks the next task as started
    :param task_id:
    :return: (CompletedTask, TaskMarkedAsStarted [can be None])
    """
    current_task: models.UserTask = models.UserTask.objects.get(id=task_id)
    current_task.completed_on = timezone.now()
    current_task.save()
    """
    get the current item current_task is representing, and then get the next sequential UserTask
    """
    next_task: models.UserTask = current_task.item.user_tasks.filter(id__gt=current_task.id).first()
    if next_task is not None and next_task.started_on:
        # prematurely started... don't undo
        next_task = None
    if next_task is not None:
        next_task.started_on = timezone.now()
        next_task.save()
    return current_task, next_task


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

"""
[20/Jan/2023 11:37:51] "GET /orders/item/13 HTTP/1.1" 200 656
[20/Jan/2023 11:37:51] "GET /orders/2/item/56 HTTP/1.1" 200 196
[20/Jan/2023 11:37:56] "POST /orders/2/item/56 HTTP/1.1" 200 1797
in HERE
"""