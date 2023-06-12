from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from tasks.models import Task
from orders.models import OrderItem
from orders.responses import UserTaskCommentResponse
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
    # comments: UserTaskComment

    def __str__(self):
        return f"UserTask(#{self.id}, {self.task.label}, {self.item})"


class UserTaskComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_task = models.ForeignKey(UserTask, on_delete=models.CASCADE, related_name="comments")
    posted_on = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=512)

    def __str__(self):
        return f"UserTaskComment(#{self.id}, {self.user.username}, {self.content[:25]}...)"

    @classmethod
    def from_response(cls, response: UserTaskCommentResponse, user: User):
        obj = cls(user=user, user_task=UserTask.objects.get(id=response.user_task_id), content=response.content)
        obj.save()
        return obj


class TaskListener(models.Model):
    """
    Used for auto assigning tasks
    is associated with a user
    Each person "listens" to a specific set of tasks from each CatalogedItem
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="listened_tasks", blank=True)
    tasks = models.ManyToManyField(Task, blank=True)
