import random

from django.db import models

from dataclasses_json import dataclass_json
from dataclasses import dataclass
from typing import TYPE_CHECKING
from tasks.models import ItemTasks, TaskSend

# Create your models here.
"""
MBProbuild Item Model:
Item Number
Type: Enum
Subtype: Enum
Style: ?
description: str
L, W, H: float
price: float
material: str
finish
balance
top style
end style
"""


"""
MENTAL MODEL
use https://franklin.mbprobuild.com/item-catalog/create

Orders have associated items with them,
which are constructed via a CatalogedItem
items have a list of Options

Options have a list of selectable OptionValues, which can be reused

OptionValue has takes a str, and an optional additional price

"""


@dataclass_json
@dataclass
class ItemOptionValueResponse:
    label: str
    subtext: str

    def __hash__(self):
        return hash((self.label, self.subtext))


@dataclass_json
@dataclass
class ItemOptionValueSend:
    id: int
    label: str
    subtext: str


@dataclass_json
@dataclass
class ItemOptionSend:
    id: int
    key: str
    allow_null: bool
    allow_multi: bool
    values: list[ItemOptionValueSend]


@dataclass_json
@dataclass
class ItemOptionResponse:
    key: str
    allow_null: bool
    allow_multi: bool
    values: list[ItemOptionValueResponse]


class ItemOption(models.Model):
    key = models.CharField(max_length=120)
    allow_null = models.BooleanField()
    allow_multi = models.BooleanField()
    is_deleted = models.BooleanField(default=False)  # TODO change all of this shit
    # values = ManyToMany ItemOptionValue

    def reduce(self):
        return [{"label": x.label, "subtext": x.subtext, "title": x.title} for x in self.values.filter(is_deleted=False)]

    @classmethod
    def new_from_response(cls, response: ItemOptionResponse):
        obj = cls(key=response.key, allow_null=response.allow_null, allow_multi=response.allow_multi)
        obj.save()
        for value in response.values:
            val = ItemOptionValue(label=value.label, subtext=value.subtext, option=obj)
            val.save()
        obj.save()
        return obj

    def __str__(self):
        return self.key


class ItemOptionValue(models.Model):
    """
    TODO what happens if the value is no longer wanted anymore?
        what if she wants to delete the value from the list and she
        wants to keep the previous orders?
    """
    label = models.CharField(max_length=120)
    subtext = models.CharField(max_length=120)  # TODO
    is_deleted = models.BooleanField(default=False)
    option = models.ForeignKey(ItemOption, on_delete=models.CASCADE, related_name="values")

    def __str__(self):
        return f"{self.label} ({self.subtext}) {{{self.option.key}}} {self.is_deleted=}"


@dataclass_json
@dataclass
class CatalogedItemResponse:
    type: str
    sub_type: str
    description: str
    commissionable: bool
    sizeable: bool
    options: list[int]


@dataclass_json
@dataclass
class CatalogedItemSend:
    """
    This is to be used to send ALL information to the client.  For example, orders/new -> items -> add item
    """
    type: str
    sub_type: str
    description: str
    commissionable: bool
    sizeable: bool
    options: list[ItemOptionSend]
    tasks: list[TaskSend]


class CatalogedItem(models.Model):
    """
    A cataloged item is an item in which is used to store the options that are then configured
    in a given order...

    An item option is configurable per item...
    i.e. style, material, polish

    for instance... a car can have a variety of styles, and polishes, and those styles and polishes
    have different colors, names, etc.

    the hope is, is that you create a single option... call it Style
    those can be plugged into different cataloged items, and not have to repeat an option every single time


    """
    # the type of the item i.e. service, Accessory, Foundation, Approval, Financial, etc.
    type = models.CharField(max_length=120)
    # the type of the type... lol i.e. if type == memorial, sub-type could be monument, tablet, base, etc.
    sub_type = models.CharField(max_length=120)  # TODO
    # a description of the item
    description = models.TextField()  # TODO
    # commission can be earned on sales of this item
    commissionable = models.BooleanField()  # TODO
    # if the item uses dimensions (length, width, height) etc
    sizeable = models.BooleanField()  # TODO
    # options of the item
    options = models.ManyToManyField(ItemOption)
    # tasks of item
    tasks = models.OneToOneField(ItemTasks, on_delete=models.CASCADE, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def orders(self) -> int:
        """
        the number of orders associated with this Cataloged Item
        :return:
        """
        # TODO
        return random.randint(20, 1000)

    @classmethod
    def new_from_response(cls, response: CatalogedItemResponse):
        obj = cls(type=response.type, sub_type=response.sub_type, description=response.description,
                  commissionable=response.commissionable, sizeable=response.sizeable)
        obj.save()
        obj.options.add(*ItemOption.objects.filter(id__in=response.options))
        obj.save()
        return obj

    def as_send(self) -> CatalogedItemSend:
        options = [
            ItemOptionSend(id=x.id,
                           key=x.key,
                           allow_null=x.allow_null,
                           allow_multi=x.allow_multi,
                           values=[ItemOptionValueSend(y.id, y.label, y.subtext) for y in x.values.filter(is_deleted=False)])
            for x in self.options.filter(is_deleted=False)
        ]
        return CatalogedItemSend(type=self.type,  # NOQA
                                 sub_type=self.sub_type,  # NOQA
                                 description=self.description,  # NOQA
                                 commissionable=self.commissionable,  # NOQA
                                 sizeable=self.sizeable,  # NOQA
                                 options=options,
                                 tasks=self.tasks.as_send() if self.tasks is not None else [])  # NOQA

    def __str__(self):
        return f"CatalogedItem(type={self.type}, sub_type={self.sub_type})"
