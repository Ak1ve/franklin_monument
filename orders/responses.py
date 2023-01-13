from dataclasses import dataclass
from dataclasses_json import dataclass_json

from contactable.responses import ContactableResponse

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


@dataclass_json
@dataclass
class OrderOverviewResponse:
    deceased: str
    cemetery_id: int
    order_type_id: int
    promise_date: str  # set up mm/dd/yyyy
    delivery_method_id: int
    tax_exempt: bool
    contact: ContactableResponse
    description_notes: str


@dataclass_json
@dataclass
class UserTaskCommentResponse:
    content: str
    user_task_id: int
