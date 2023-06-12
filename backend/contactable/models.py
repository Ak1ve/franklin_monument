from django.db import models

# Create your models here.
from .responses import ContactableResponse


class Contact(models.Model):
    name = models.CharField(max_length=128, blank=True)
    organization = models.CharField(max_length=128, blank=True)
    email = models.CharField(max_length=128, blank=True)
    phone_number = models.CharField(max_length=128, blank=True)
    fax_number = models.CharField(max_length=128, blank=True)
    website = models.CharField(max_length=256, blank=True)
    notes = models.TextField(blank=True)

    def edit_from_response(self, response: ContactableResponse) -> None:
        self.name = response.name
        self.organization = response.organization
        self.email = response.email
        self.phone_number = response.phone_number
        self.fax_number = response.fax_number
        self.website = response.website
        self.notes = response.notes
        self.save()

    def __str__(self):
        return f"Contact(#{self.id}, name={self.name}, organization={self.organization})"
