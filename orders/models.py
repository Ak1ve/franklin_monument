import random

from django.db import models
from contactable.models import Contact


from dataclasses_json import dataclass_json
from dataclasses import dataclass

# Create your models here.
import items.models as item_models
from addressbook.models import Cemetery


@dataclass_json
@dataclass
class SpecificationResponse:
    option_id: int
    option_value_ids: list[int]


@dataclass_json
@dataclass
class ItemTaskResponse:
    task_id: int
    user_id: int | None


@dataclass_json
@dataclass
class OrderItemResponse:
    type_id: int
    specifications: list[SpecificationResponse]
    dimensions: tuple[int, int, int] | None
    price: str
    tax_exempt: bool
    notes: str
    tasks: list[ItemTaskResponse]


class OrderType(models.Model):
    type_name = models.CharField(max_length=128)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.type_name


class DeliveryMethod(models.Model):
    method_name = models.CharField(max_length=128)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.method_name


class Overview(models.Model):
    class StatusChoices(models.TextChoices):
        CANCELLED = "Cancelled"
        ACTIVE = "Active"
        PRODUCTION_HOLD = "Production Hold"
        READY_TO_INVOICE = "Ready To Invoice"
        INVOICED = "Invoiced"
        PAID = "Paid"

    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.ACTIVE, max_length=16)
    deceased_name = models.CharField(max_length=512, blank=True)
    order_type = models.ForeignKey(OrderType, on_delete=models.CASCADE, blank=True)
    promise_date = models.DateField(blank=True)
    customer_contact = models.ForeignKey(Contact, on_delete=models.CASCADE, blank=True)
    tax_exempt = models.BooleanField(default=False)
    delivery_method = models.ForeignKey(DeliveryMethod, on_delete=models.CASCADE, blank=True)
    cemetery = models.ForeignKey(Cemetery, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True)

    def status_color(self) -> str:
        # this is for main.css badge colors
        return str(self.status).lower().replace("/", "-").replace(" ", "-")

    def __str__(self):
        return f"Overview(#{self.id}, {self.deceased_name}, status={self.status}, order_type={self.order_type}, contact={self.customer_contact})"


class ItemSet(models.Model):
    # items
    pass


class ItemSpecificationSet(models.Model):
    # specifications = ItemSpecification
    @classmethod
    def from_response(cls, response: list[SpecificationResponse]):
        obj = cls()
        obj.save()
        for spec in response:
            item_spec = ItemSpecification(option=item_models.ItemOption.objects.get(id=spec.option_id),
                                          specification_set=obj)
            item_spec.save()
            item_spec.values.set(item_models.ItemOptionValue.objects.filter(id__in=spec.option_value_ids))
            item_spec.save()
        obj.save()
        return obj

    def as_send(self) -> list[SpecificationResponse]:
        return [x.as_send() for x in self.specifications.all()]

    def __str__(self):
        return f"ItemSpecifications({self.id}, " + ", ".join(f"{x}" for x in self.specifications.all()) + ")"


class ItemSpecification(models.Model):
    option = models.ForeignKey(item_models.ItemOption, on_delete=models.CASCADE)
    values = models.ManyToManyField(item_models.ItemOptionValue)
    specification_set = models.ForeignKey(ItemSpecificationSet, on_delete=models.CASCADE, related_name="specifications")

    def as_send(self) -> SpecificationResponse:
        return SpecificationResponse(option_id=self.option.id, option_value_ids=[y.id for y in self.values.all()])

    def __str__(self):
        return f"ItemSpecification({self.id}, {self.option.key}=" + ", ".join(f"{x.label}" for x in self.values.all()) + ")"


class Vector3(models.Model):
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()

    def __str__(self):
        return f"{self.length} x {self.width} x {self.height}"


class OrderItem(models.Model):
    item_set = models.ForeignKey(ItemSet, on_delete=models.CASCADE, related_name="items")
    cataloged_item = models.ForeignKey(item_models.CatalogedItem, on_delete=models.CASCADE, blank=True, null=True)
    specification_set = models.OneToOneField(ItemSpecificationSet, on_delete=models.CASCADE, blank=True, null=True)
    dimensions = models.OneToOneField(Vector3, on_delete=models.CASCADE, blank=True, null=True)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    notes = models.TextField()
    tax_exempt = models.BooleanField()
    # tasks = None  # TODO

    def as_send(self) -> OrderItemResponse:
        type_id: int
        specifications: list[SpecificationResponse]
        dimensions: tuple[int, int, int] | None
        price: str
        tax_exempt: bool
        notes: str
        tasks: list[ItemTaskResponse]
        type_id = self.cataloged_item.id
        specifications = self.specification_set.as_send()
        dimensions = None if self.dimensions is None else (self.dimensions.length, self.dimensions.width, self.dimensions.height)
        price = self.price
        tax_exempt = self.tax_exempt
        notes = self.notes
        tasks = []  # TODO
        return OrderItemResponse(type_id=type_id, specifications=specifications, dimensions=dimensions,
                                 price=price, tax_exempt=tax_exempt, notes=notes, tasks=tasks)

    def __str__(self):
        return f"OrderItem(item={self.cataloged_item.type}, dimensions={self.dimensions}, price={self.price}, specs={self.specification_set})"


class Order(models.Model):
    """
    An order should have an overview, associated items, memorial placement
    """
    item_set = models.OneToOneField(ItemSet, null=True, blank=True, on_delete=models.CASCADE)
    order_created = models.DateTimeField(auto_now_add=True)
    overview = models.OneToOneField(Overview, on_delete=models.CASCADE, null=True)
    # created_by
    is_deleted = models.BooleanField(default=False)
    # user_tasks

    def __str__(self):
        return f"Order(#{self.id})"

    def tasks_completed(self):
        # TODO
        return random.randint(10, 100)

    def total_tasks(self):
        # TODO
        return random.randint(100, 200)
