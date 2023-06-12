from django.http import HttpResponseServerError, HttpResponse
from django.shortcuts import render

from .models import Contact, Cemetery, CemeteryResponse


# Create your views here.
def address_home(request):
    return render(request, "address_home.html", {"cemeteries": Cemetery.objects.all()})


def address_view(request, address_id: int = None):

    if request.method == "GET":
        obj = Cemetery.objects.get(id=address_id) if address_id is not None else None
        return render(request, "address_view.html", {"cemetery": obj})

    if not request.user.is_superuser:
        return HttpResponseServerError(b"{'error': 'Not Authenticated'}")

    if request.method == "POST":
        response: CemeteryResponse = CemeteryResponse.__pydantic_model__.parse_raw(request.body)

        if address_id is None:
            Cemetery.new_from_response(response)
        else:
            obj: Cemetery = Cemetery.objects.get(id=address_id)
            obj.edit_from_response(response)
        return HttpResponse(b"{}")

    if request.method == "DELETE":
        Cemetery.objects.get(id=address_id).delete()
        return HttpResponse(b"{}")


