import os

from django.db import models


# Create your models here.
class DocumentFile(models.Model):
    file_path = models.TextField()
    hash = models.CharField(max_length=256)

    def short_name(self) -> str:
        """
        Returns the short name (strips out documents/ and time information)
        :return:
        """
        return self.file_path[len("documents/XXXXXXXX XX-XX-XX "):]

    def __str__(self):
        return f"File(#{self.id}, {self.file_path})"

    def delete(self, using=None, keep_parents=False):
        os.remove(self.file_path)
        super().delete(using, keep_parents)
