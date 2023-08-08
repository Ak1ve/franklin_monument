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


class Permissions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="permissions", blank=True)
    # CatalogedItems
    can_create_cataloged_items = models.BooleanField(default=False)
    can_edit_cataloged_items = models.BooleanField(default=False)
    can_delete_cataloged_items = models.BooleanField(default=False)
    can_view_cataloged_items = models.BooleanField(default=True)

    # CatalogedTasks
    can_create_cataloged_tasks = models.BooleanField(default=False)
    can_edit_cataloged_tasks = models.BooleanField(default=False)
    can_delete_cataloged_tasks = models.BooleanField(default=False)
    can_view_cataloged_tasks = models.BooleanField(default=True)

    # Address
    can_create_addresses = models.BooleanField(default=False)
    can_edit_addresses = models.BooleanField(default=False)
    can_delete_addresses = models.BooleanField(default=False)
    can_view_addresses = models.BooleanField(default=True)

    # Orders
    can_create_orders = models.BooleanField(default=False)
    can_edit_orders = models.BooleanField(default=False)
    can_view_orders = models.BooleanField(default=False)
    # If they can force start a UserTask in the items/[id] menu
    can_force_start_tasks = models.BooleanField(default=False)
    # if they can upload documents in Order proofs or documents
    can_upload_documents = models.BooleanField(default=False)
    # if they can make a comment in Order Tasks
    can_make_tasks_comments = models.BooleanField(default=False)
    # if they can mark an Order tasks as complete that isn't theirs
    can_mark_foreign_task_complete = models.BooleanField(default=False)
    # if they can add an order item
    can_create_order_items = models.BooleanField(default=False)
    can_edit_order_items = models.BooleanField(default=False)
    # if they can review financial info for order items and Order financial summary
    can_view_order_financials = models.BooleanField(default=False)

    # Reports
    can_view_reports = models.BooleanField(default=False)

    # Users
    can_create_users = models.BooleanField(default=False)
    can_edit_users = models.BooleanField(default=False)
    can_delete_users = models.BooleanField(default=False)



