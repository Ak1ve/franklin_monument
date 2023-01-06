from django.db import models

# Create your models here.


class Contact(models.Model):
    name = models.CharField(max_length=128, blank=True)
    organization = models.CharField(max_length=128, blank=True)
    email = models.CharField(max_length=128, blank=True)
    phone_number = models.CharField(max_length=128, blank=True)
    fax_number = models.CharField(max_length=128, blank=True)
    website = models.CharField(max_length=256, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Contact(#{self.id}, name={self.name}, organization={self.organization})"
