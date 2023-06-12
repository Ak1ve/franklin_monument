from dataclasses_json import dataclass_json
from dataclasses import dataclass


@dataclass_json
@dataclass
class ContactableResponse:
    name: str
    organization: str
    email: str
    phone_number: str
    fax_number: str
    website: str
    notes: str
