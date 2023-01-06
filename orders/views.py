from django.http import JsonResponse, HttpResponseNotAllowed
from django.template import loader
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from items.models import CatalogedItem
from items.views import get_sub_types
from .models import OrderItemResponse
from . import models


# Create your views here.
def orders_home(request):
    orders = models.Order.objects.all() # TODO is_deleted filter
    return render(request, "orders_home.html", {"orders": orders})


def order_new(request):
    """
    Creates a new order and sends a redirect to the form
    :param request:
    :return:
    """
    # TODO order created by
    # order = models.Order()
    # order.save()
    # overview = models.Overview()
    # overview.save()
    # order.overview = overview()
    # order.save()
    # TODO fix when done
    # return HttpResponseRedirect(f"/orders/{order.id}")
    return HttpResponseRedirect("/orders/2")


def order_view(request, order_id: int):
    cataloged_items = [{"sub_type": sub_type, "items": CatalogedItem.objects.filter(sub_type=sub_type, is_deleted=False)}
                       for sub_type in get_sub_types()]
    # TODO assigned to people maybe?
    overview = {"delivery_methods": models.DeliveryMethod.objects.filter(is_deleted=False),
                "order_types": models.OrderType.objects.filter(is_deleted=False)}
    return render(request, "order_view.html", {"cataloged_items": cataloged_items,
                                               "order": models.Order.objects.get(id=order_id),
                                               "overview": overview
                                               })


def order_item_send(request, item_id: int):
    obj: CatalogedItem = CatalogedItem.objects.get(id=item_id)
    return JsonResponse(obj.as_send().to_json(), safe=False)


def create_item_from_response(response: models.OrderItemResponse, order_id: int) -> models.OrderItem:
    """
    returns order item
    :param response:
    :param order_id:
    :return:
    """
    order = models.Order.objects.get(id=order_id)
    # TODO not this!
    if order.item_set is None:
        item_set = models.ItemSet()
        item_set.save()
        order.item_set = item_set
    cataloged_item = CatalogedItem.objects.get(id=response.type_id)
    specifications = models.ItemSpecificationSet.from_response(response.specifications)
    dimensions = None
    if response.dimensions is not None:
        obj = models.Vector3(length=float(response.dimensions[0]), width=float(response.dimensions[1]),
                             height=float(response.dimensions[2]))
        obj.save()
        dimensions = obj
    item = models.OrderItem(
        item_set=order.item_set,
        cataloged_item=cataloged_item,
        specification_set=specifications,
        dimensions=dimensions,
        price=response.price,
        notes=response.notes,
        tax_exempt=response.tax_exempt
    )  # TODO tasks
    item.save()
    order.save()
    return item


def edit_item_from_response(response: models.OrderItemResponse, item_id: int) -> models.OrderItem:
    # this does not include tasks, because tasks are edited differently
    item: models.OrderItem = models.OrderItem.objects.get(id=item_id)
    item.specification_set.delete()
    spec_set = models.ItemSpecificationSet.from_response(response.specifications)
    spec_set.save()
    item.specification_set = spec_set
    if item.dimensions is not None:
        item.dimensions.delete()
        dimensions = models.Vector3(length=response.dimensions[0], width=response.dimensions[1],
                                    height=response.dimensions[2])
        dimensions.save()
        item.dimensions = dimensions
    item.price = response.price
    item.notes = response.notes
    item.tax_exempt = response.tax_exempt
    item.save()
    return item


def order_item_view(request, order_id: int, item_id: int = None):
    """
    Viewing an item of an order,
    GET: returns json response of order item.  models.OrderItemResponse
    POST: Post either a new item object, or an edit of an existing object
    DELETE: Delete item_id
    :param request:
    :param order_id:
    :param item_id:
    :return:
    """
    if request.method == "GET" and item_id is not None:
        # return item
        obj: models.OrderItemResponse = models.OrderItem.objects.get(id=item_id).as_send()
        return JsonResponse(obj.to_json(), safe=False)
    # TODO order_item id!!
    if not request.user.is_authenticated:
        return HttpResponseNotAllowed(b"{'error': 'Not Authenticated'}")
    if request.method == "POST" and item_id is None:
        # create a new item
        body = OrderItemResponse.from_json(request.body)
        item = create_item_from_response(body, order_id)
        content = loader.render_to_string("common/order_item_card.html", {"order_item": item}, request, using=None)
        return JsonResponse({"body": content})
    if request.method == "POST" and item_id is not None:
        item = edit_item_from_response(OrderItemResponse.from_json(request.body), item_id)
        content = loader.render_to_string("common/order_item_card.html", {"order_item": item}, request, using=None)
        return JsonResponse({"body": content})
    if request.method == "DELETE":
        # delete item
        item: models.OrderItem = models.OrderItem.objects.get(id=item_id)
        item.specification_set.delete()
        if item.dimensions:
            item.dimensions.delete()
        item.delete()

    return HttpResponse("{}")