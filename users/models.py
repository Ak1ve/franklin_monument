from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from tasks.models import Task
from orders.models import OrderItem
from dataclasses import dataclass
from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class UserAssignedTask:
    task_id: int
    user_id: int


@dataclass_json
@dataclass
class AutoAssignTaskSend:
    """
    """
    tasks: list[UserAssignedTask]


class UserTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="user_tasks", null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="user_tasks", null=True)
    item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name="user_tasks", blank=True, null=True)
    started_on = models.DateTimeField(blank=True, null=True)
    completed_on = models.DateTimeField(blank=True, null=True)


class TaskListener(models.Model):
    """
    Used for auto assigning tasks
    is associated with a user
    Each person "listens" to a specific set of tasks from each CatalogedItem
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="listened_tasks", blank=True)
    tasks = models.ManyToManyField(Task, blank=True)