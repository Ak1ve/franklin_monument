from django.db import models

from dataclasses import dataclass
from dataclasses_json import dataclass_json

# Create your models here.


@dataclass_json
@dataclass
class TaskResponse:
    label: str
    description: str


@dataclass_json
@dataclass
class TaskSend:
    id: int
    label: str
    description: str


@dataclass_json
@dataclass
class ItemTasksResponse:
    tasks: list[TaskResponse]


class ItemTasks(models.Model):
    @classmethod
    def new_from_response(cls, response: ItemTasksResponse):
        obj = cls()
        obj.save()
        obj.tasks.add(*[Task.new_from_response(x) for x in response.tasks])
        obj.save()
        return obj

    def as_send(self) -> list[TaskSend]:
        return [TaskSend(x.id, x.label, x.description) for x in self.tasks.all()]


class Task(models.Model):
    label = models.CharField(max_length=50)
    description = models.CharField(max_length=120)
    item_task = models.ForeignKey(ItemTasks, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    triggers_after = models.ManyToManyField("self", blank=True)
    order_number = models.IntegerField(default=0)
    triggers_at_beginning = models.BooleanField(default=False)
    triggers_at_all_tasks = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    @classmethod
    def new_from_response(cls, response: TaskResponse):
        obj = cls(label=response.label, description=response.description)
        obj.save()
        return obj

    def __str__(self):
        deleted = self.is_deleted
        return f"Task(#{self.id} {self.label}, {self.description}, {deleted=})"
