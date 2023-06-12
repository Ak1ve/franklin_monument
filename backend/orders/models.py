import datetime

from django.contrib.auth.models import User
from django.db import models
from contactable.models import Contact
# Create your models here.
import items.models as item_models
from addressbook.models import Cemetery
from document.models import DocumentFile
from .responses import SpecificationResponse, ItemTaskResponse, OrderItemResponse, OrderOverviewResponse, OrderPlacementResponse


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
    deceased_name = models.CharField(max_length=512, blank=True)
    order_type = models.ForeignKey(OrderType, on_delete=models.CASCADE, blank=True)
    promise_date = models.DateField(blank=True)
    customer_contact: Contact = models.ForeignKey(Contact, on_delete=models.CASCADE, blank=True)
    tax_exempt = models.BooleanField(default=False)
    delivery_method = models.ForeignKey(DeliveryMethod, on_delete=models.CASCADE, blank=True)
    cemetery = models.ForeignKey(Cemetery, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Overview(#{self.id}, {self.deceased_name}, order_type={self.order_type}, contact={self.customer_contact})"

    def edit_from_response(self, response: OrderOverviewResponse) -> None:
        self.deceased_name = response.deceased
        self.order_type = OrderType.objects.get(id=response.order_type_id)
        self.promise_date = datetime.datetime.strptime(response.promise_date, "%m/%d/%Y")
        self.customer_contact.edit_from_response(response.contact)
        self.tax_exempt = response.tax_exempt
        self.delivery_method = DeliveryMethod.objects.get(id=response.delivery_method_id)
        self.cemetery = Cemetery.objects.get(id=response.cemetery_id)
        self.description = response.description_notes
        self.save()


class ItemSet(models.Model):
    # items
    # order
    pass


class ItemSpecificationSet(models.Model):
    # specifications = ItemSpecification
    def set_from_response(self, response: list[SpecificationResponse]):
        self.save()
        self.specifications.all().delete()
        for spec in response:
            item_spec = ItemSpecification(option=item_models.ItemOption.objects.get(id=spec.option_id),
                                          specification_set=self)
            item_spec.save()
            item_spec.values.set(item_models.ItemOptionValue.objects.filter(id__in=spec.option_value_ids))
            item_spec.save()
        self.save()
        return self

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
    # user_tasks: users.models.UserTask

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

    def task_status(self) -> str:
        """
        used for order_task_item_card
        if ANY of the tasks are NOT started, returns missing
        if not -> ANY task that is not completed returns warning
        else -> success
        :return:
        """
        not_complete = False
        for user_task in self.user_tasks.all():
            if user_task.started_on is None:
                return "missing"
            if user_task.completed_on is None:
                not_complete = True
        if not_complete:
            return "warning"
        return "success"

    def __str__(self):
        return f"OrderItem(item={self.cataloged_item.type}, dimensions={self.dimensions}, price={self.price}, specs={self.specification_set})"


class DesignProofs(models.Model):
    files = models.ManyToManyField(DocumentFile)
    notes = models.TextField()


class Documents(models.Model):
    files = models.ManyToManyField(DocumentFile)
    notes = models.TextField()


class PlacementNames(models.Model):
    placement_1 = models.TextField(null=True, blank=True)
    placement_2 = models.TextField(null=True, blank=True)
    placement_3 = models.TextField(null=True, blank=True)
    placement_4 = models.TextField(null=True, blank=True)
    placement_5 = models.TextField(null=True, blank=True)
    placement_6 = models.TextField(null=True, blank=True)
    placement_7 = models.TextField(null=True, blank=True)
    placement_8 = models.TextField(null=True, blank=True)


class MemorialPlacement(models.Model):
    placement_names = models.OneToOneField(PlacementNames, on_delete=models.CASCADE)
    memorial_placement = models.IntegerField(default=1)  # internal numerical system
    read_top = models.BooleanField(default=True)
    section = models.CharField(max_length=255, blank=True)
    lot = models.CharField(max_length=255, blank=True)
    grave = models.CharField(max_length=255, blank=True)
    face_stone = models.CharField(max_length=255, default="Unspecified")
    foundation_length = models.CharField(max_length=255, blank=True)
    foundation_width = models.CharField(max_length=255, blank=True)
    notes = models.TextField(null=True, blank=True)

    def edit_from_response(self, response: OrderPlacementResponse) -> None:
        for i in range(1, 9):
            setattr(self.placement_names, f"placement_{i}", response.placement_names.pop(0))
        self.placement_names.save()  # NOQA
        self.read_top = response.read_top
        self.memorial_placement = response.memorial_placement
        self.section = response.section
        self.lot = response.lot
        self.grave = response.grave
        self.face_stone = response.face_stone
        self.foundation_length = response.foundation_length
        self.foundation_width = response.foundation_width
        self.notes = response.notes
        self.save()


class Order(models.Model):
    """
    An order should have an overview, associated items, memorial placement
    """
    class StatusChoices(models.TextChoices):
        CANCELLED = "Cancelled"
        ACTIVE = "Active"
        PRODUCTION_HOLD = "Production Hold"
        READY_TO_INVOICE = "Ready To Invoice"
        INVOICED = "Invoiced"
        PAID = "Paid"

    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.ACTIVE, max_length=16)
    item_set = models.OneToOneField(ItemSet, null=True, blank=True, on_delete=models.CASCADE, related_name="order")
    proofs = models.OneToOneField(DesignProofs, null=True, blank=True, on_delete=models.CASCADE)
    placement = models.OneToOneField(MemorialPlacement, null=True, blank=True, on_delete=models.CASCADE)
    order_created = models.DateTimeField(auto_now_add=True)
    documents = models.OneToOneField(Documents, on_delete=models.CASCADE, null=True, blank=True)
    overview = models.OneToOneField(Overview, on_delete=models.CASCADE, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Order(#{self.id})"

    def status_color(self) -> str:
        # this is for main.css badge colors
        return str(self.status).lower().replace("/", "-").replace(" ", "-")

    def tasks_completed(self):
        completed = 0
        if self.item_set is None:
            return 0
        for item in self.item_set.items.all():
            completed += len(item.user_tasks.exclude(completed_on__isnull=True))
        return completed

    def total_tasks(self):
        total = 0
        if self.item_set is None:
            return 0
        for item in self.item_set.items.all():
            total += len(item.user_tasks.all())
        return total
