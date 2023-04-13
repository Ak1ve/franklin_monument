import hashlib

from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotAllowed
from django.shortcuts import render
from django.utils import timezone

import document.models
from . import models


# Create your views here.
def load_document(request, file_id: int, name: str):
    file = models.DocumentFile.objects.get(id=file_id)
    with open(file.file_path, "rb") as f:
        response = HttpResponse(f.read(), content_type='application/pdf')
        return response


def delete_document(request, file_id: int):
    if not request.user.is_superuser:
        return HttpResponseNotAllowed(b"{'err': 'Not authenticated'}")
    file = models.DocumentFile.objects.get(id=file_id)
    file.delete()
    return HttpResponse(b"{}")


def redirect(request, file_id: int):
    if request.method == "DELETE":
        return delete_document(request, file_id)
    file = models.DocumentFile.objects.get(id=file_id)
    return HttpResponseRedirect(f"/documents/{file_id}/{file.short_name()}")

# def file_view(request, file_id: int):


def save_request_file(request_file, root_folder: str = "documents", max_length: int = 64):
    def save_file(destination, file) -> str:
        file_hash = hashlib.sha256()
        for chunk in file:
            destination.write(chunk)
            file_hash.update(chunk)
        return file_hash.hexdigest()
    # this technically means that if there is no file extension... it might break
    # but alas, I don't think they will be uploading anything like that
    file_name, extension = (timezone.now().strftime("%m%d%Y %H-%M-%S ") + request_file.name).rsplit(".", maxsplit=1)
    file_path = f"{root_folder}/{file_name[:max_length - len(extension)]}.{extension}"
    with open(file_path, "wb+") as dest:
        hsh = save_file(dest, request_file)
        file = document.models.DocumentFile(file_path=file_path, hash=hsh)
        file.save()
        return file