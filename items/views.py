import json

from django.shortcuts import render, HttpResponse
from django.http.response import HttpResponseServerError, JsonResponse
from django.forms.models import model_to_dict
from django.core.serializers import serialize


from . import models


def get_references():
    references: dict[str, list[models.ItemOption]] = {}
    for obj in models.CatalogedItem.objects.filter(is_deleted=False):
        if obj.sub_type not in references:
            references[obj.sub_type] = []
        references[obj.sub_type].extend(
            option for option in obj.options.filter(is_deleted=False) if option not in references[obj.sub_type])

    return [{"subtype": k, "options": v} for k, v in references.items()]


def get_sub_types():
    return set(x.sub_type for x in models.CatalogedItem.objects.filter(is_deleted=False))


# Create your views here.
def item_home(request):
    """
    A view of the item catalog

    GET: view the catalog; returns html view

    :param request:
    :return:
    """
    return render(request, "item_catalog.html", {"items": models.CatalogedItem.objects.filter(is_deleted=False)})


def item_view(request, item_id: int):
    """
    Viewing, editing, or deleting a specified item

    GET: view the item; returns View
    DELETE: deletes the item; returns OK
    POST: ALTER item uses models.CatalogedItemResponse

    :param request:
    :param item_id:
    :return:
    """
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return HttpResponseServerError(json.dumps({"error": "Not Authenticated"}))
        x = models.CatalogedItem.objects.get(id=item_id)
        x.is_deleted = True
        x.save()
        return HttpResponse(b"{}")
    if request.method == "GET":
        obj = models.CatalogedItem.objects.get(id=item_id)
        return render(request, "item_new.html", {"references": get_references(), "cataloged_item": obj,
                                                 "options": obj.options.all(), "sub_types": get_sub_types()})
    # is post
    if not request.user.is_superuser:
        return HttpResponseServerError(json.dumps({"error": "Not Authenticated"}))

    body = models.CatalogedItemResponse.from_json(request.body)

    obj: models.CatalogedItem = models.CatalogedItem.objects.get(id=item_id)
    obj.type = body.type
    obj.sub_type = body.sub_type
    obj.sizeable = body.sizeable
    obj.commissionable = body.commissionable
    obj.description = body.description
    obj.options.remove(*obj.options.all())
    obj.options.add(*models.ItemOption.objects.filter(id__in=body.options))
    obj.save()
    return HttpResponse(b"{}")


def item_new(request):
    """
    A view for creating a new item
    GET: the html view
    POST: uses models.CatalogedItemResponse
    :param request:
    :return:
    """
    if request.method == "POST":
        if not request.user.is_superuser:
            return HttpResponseServerError(b"{'error': 'Not Authenticated'}")
        response = models.CatalogedItemResponse.from_json(request.body)
        models.CatalogedItem.new_from_response(response)
        return HttpResponse(b"{}")

    return render(request, "item_new.html", {"references": get_references(), "sub_types": get_sub_types()})


def item_option(request):
    """
    Takes a JSON request for saving a NEW option.  Uses models.ItemOptionResponse

    POST: adds JSON data to database; returns model_id
    :param request:
    :return:
    """
    if request.method != "POST" or not request.user.is_superuser:
        return HttpResponseServerError(b"{'error': 'Not Authenticated'}")

    response = models.ItemOptionResponse.from_json(request.body)
    option = models.ItemOption.new_from_response(response)

    return JsonResponse({"option_id": option.id})


def item_option_id(request, option_id: int):
    """
    A view for fetching, posting, or deleting `models.ItemOption` data
    Uses models.ItemOptionResponse for inter-op.  Takes JSON or GET method

    if GET: get the option model; returns JSON data of option
    if POST: edits option values of option_id; returns option_id
    if DELETE: deletes the option; returns OK
    :param request:
    :param option_id:
    :return:
    """
    if request.method == "GET":
        obj_model = models.ItemOption.objects.get(id=option_id)
        obj = model_to_dict(obj_model)
        vals = json.loads(serialize("json", obj_model.values.all()))
        obj.update({"values": [{k: v for k, v in x["fields"].items() if k in ("label", "subtext")} for x in vals]})
        return JsonResponse(obj)

    # IS POST or DELETE
    if not request.user.is_superuser:
        return HttpResponseServerError(json.dumps({"error": "Not Authenticated"}))

    if request.method == "DELETE":
        obj = models.ItemOption.objects.get(id=option_id)
        obj.is_deleted = True
        obj.save()

        return HttpResponse(b"{}")

    body: models.ItemOptionResponse = models.ItemOptionResponse.from_json(request.body)
    obj = models.ItemOption.objects.get(id=option_id)
    # TODO finish!
    for x in obj.values.exclude(label__in=[y.label for y in body.values]):
        # delete
        x.is_deleted = True
        x.save()
    # new values
    # KNOWN BUG: if PURELY THE SUBTEXT changes, it will think it is the same item...
    # I have decided to not do anything about it... because its so small
    for x in set(v for v in body.values if v.label not in set(x.label for x in obj.values.all())):
        models.ItemOptionValue(label=x.label, subtext=x.subtext, option=obj).save()
    obj.key = body.key
    obj.allow_multi = body.allow_multi
    obj.allow_null = body.allow_null
    obj.save()
    return JsonResponse({"option_id": obj.id})


