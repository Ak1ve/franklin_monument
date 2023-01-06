from django.db import models
import json
from pydantic.dataclasses import dataclass

from contactable.models import Contact


@dataclass
class CemeteryResponse:
    contact_name: str
    organization: str
    email: str
    phone_number: str
    fax_number: str
    website: str
    address: str
    notes: str


class Cemetery(models.Model):
    contact = models.OneToOneField(Contact, on_delete=models.CASCADE)
    address = models.CharField(max_length=256, blank=True)

    @classmethod
    def new_from_response(cls, response: CemeteryResponse):
        contact = Contact(name=response.contact_name,
                          organization=response.organization,
                          email=response.email,
                          phone_number=response.phone_number,
                          fax_number=response.fax_number,
                          website=response.website,
                          notes=response.notes)
        contact.save()
        obj = cls(contact=contact, address=response.address)
        obj.save()
        return obj

    def edit_from_response(self, response: CemeteryResponse) -> None:
        self.contact: Contact
        self.contact.notes = response.notes
        self.contact.website = response.website
        self.contact.email = response.email
        self.contact.organization = response.organization
        self.contact.fax_number = response.fax_number
        self.contact.name = response.contact_name
        self.address = response.address
        self.save()

    def __str__(self):
        return str(self.contact)


