import json

from django.utils import timezone

from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseServerError
from django.template import loader
from django.shortcuts import render, HttpResponse, HttpResponseRedirect

from document.views import save_request_file
from items.models import CatalogedItem
from items.views import get_sub_types
from . import models
from users.models import UserTask, UserTaskComment
from users.views import complete_task, start_task
from .responses import OrderItemResponse, OrderOverviewResponse, UserTaskCommentResponse
from addressbook.models import Cemetery


TASK_DATE_FORMAT = "%m/%d/%y %I:%M %p"


# Create your views here.
def orders_home(request):
    orders = models.Order.objects.all()
    return render(request, "orders_home.html", {"orders": orders})


def order_new(request):
    """
    Creates a new order and sends a redirect to the form
    :param request:
    :return:
    """
    if not request.user.is_superuser:
        return HttpResponseNotAllowed("{'err': 'Not Authenticated'}")
    order = models.Order(user=request.User)
    order.save()

    overview = models.Overview()
    overview.save()
    proofs = models.DesignProofs()
    proofs.save()

    order.overview = overview
    order.proofs = proofs

    order.save()

    # return HttpResponseRedirect(f"/orders/{order.id}")
    return HttpResponseRedirect("/orders/2")


def order_view(request, order_id: int):
    order = models.Order.objects.get(id=order_id)
    cataloged_items = [{"sub_type": sub_type, "items": CatalogedItem.objects.filter(sub_type=sub_type, is_deleted=False)}
                       for sub_type in get_sub_types()]
    # TODO assigned to people maybe?
    overview = {"delivery_methods": models.DeliveryMethod.objects.filter(is_deleted=False),
                "order_types": models.OrderType.objects.filter(is_deleted=False),
                "cemeteries": Cemetery.objects.all()}
    return render(request, "order_view.html", {"cataloged_items": cataloged_items,
                                               "order": order,
                                               "overview": overview,
                                               "users": User.objects.all()
                                               })


def order_item_send(request, item_id: int):
    obj: CatalogedItem = CatalogedItem.objects.get(id=item_id)
    return JsonResponse(obj.as_send().to_json(), safe=False)


def create_item_from_response(response: OrderItemResponse, order_id: int) -> models.OrderItem:
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
    specifications = models.ItemSpecificationSet()
    specifications.set_from_response(response.specifications)
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
    tasks_dict = {x.task_id: x.user_id for x in response.tasks if x.user_id}
    for task in cataloged_item.tasks.tasks.all():
        user_id = tasks_dict.get(task.id, None)
        if user_id:
            user_task = UserTask(user=User.objects.get(id=user_id), item=item, task=task)
            user_task.save()
            continue
        UserTask(user=None, item=item, task=task).save()

    return item


def edit_item_from_response(response: OrderItemResponse, item_id: int) -> models.OrderItem:
    # this does not include tasks, because tasks are edited differently
    item: models.OrderItem = models.OrderItem.objects.get(id=item_id)
    item.specification_set.set_from_response(response.specifications)

    if item.dimensions is not None:
        item.dimensions.delete()
        dimensions = models.Vector3(length=response.dimensions[0], width=response.dimensions[1],
                                    height=response.dimensions[2])
        dimensions.save()
        item.dimensions = dimensions
        print(item.user_tasks.all())
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
        obj: OrderItemResponse = models.OrderItem.objects.get(id=item_id).as_send()
        return JsonResponse(obj.to_json(), safe=False)
    if not request.user.is_authenticated:
        return HttpResponseNotAllowed(b"{'error': 'Not Authenticated'}")
    if request.method == "POST" and item_id is None:
        # create a new item
        body = OrderItemResponse.from_json(request.body)
        item = create_item_from_response(body, order_id)
        content = loader.render_to_string("common/order_item_card.html", {"order_item": item}, request, using=None)
        return JsonResponse({"body": content})
    if request.method == "POST" and item_id is not None:
        # THIS IS WHERE THE ERROR IS HAPPENING
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


# order sections
def order_overview(request, order_id: int):
    if request.method != "POST":
        return HttpResponseNotAllowed(b"{'err': 'Can only be POST'}")
    if not request.user.is_superuser:
        return HttpResponseServerError(b"{'err': 'Not authenticated'}")

    response: OrderOverviewResponse = OrderOverviewResponse.from_json(request.body)
    print(response)
    overview: models.Overview = models.Order.objects.get(id=order_id).overview
    overview.edit_from_response(response)
    return HttpResponse(b"{}")


# tasks
def user_comment_view(request, user_comment_id: int = None):
    """
    DELETE: deletes user_comment
    POST: Posts a comment
    :param request:
    :param user_comment_id:
    :return:
    """
    if not request.user.is_superuser:
        return HttpResponseServerError(b"{'err': 'Not authenticated'}")
    if request.method == "POST":
        response = UserTaskCommentResponse.from_json(request.body)
        obj = None
        if user_comment_id is None:
            obj = UserTaskComment.from_response(response, request.user)
        else:
            obj = UserTaskComment.objects.get(id=user_comment_id)
            obj.content = response.content
            obj.posted_on = timezone.now()
            obj.save()
        return JsonResponse({"body": loader.render_to_string("common/order_task_comment.html", {"comment": obj})})
    elif request.method == "DELETE":
        obj = UserTaskComment.objects.get(id=user_comment_id)
        obj.delete()
        return HttpResponse("{}")


def user_task_view(request, task_id: int):
    """
    POST: change the assigned task.
    data is just an array of user ids. either [1] or []
    :param request:
    :param task_id:
    :return:
    """
    # TODO logic with starting / completing
    if request.method != "POST" or not request.user.is_superuser:
        return HttpResponseServerError("{'err': 'Not authorized'}")
    task = UserTask.objects.get(id=task_id)
    body = [int(x) for x in json.loads(request.body)]
    if not len(body):
        # cleared the user
        task.user = None
    else:
        user = User.objects.get(id=body[0])
        task.user = user
    task.started_on = None
    task.completed_on = None
    task.save()
    return HttpResponse("{}")


def user_task_start(request, task_id: int):
    if request.method != "POST" or not request.user.is_superuser:
        return HttpResponseNotAllowed("{'err': 'Not allowed'}")
    task = start_task(task_id)
    return JsonResponse({"start_time": task.started_on.strftime(TASK_DATE_FORMAT)})


def user_task_complete(request, task_id: int):
    if request.method != "POST" or not request.user.is_superuser:
        return HttpResponseNotAllowed("{'err': 'Not allowed'}")
    current_task, next_task = complete_task(task_id)
    start_time = next_task.started_on.strftime(TASK_DATE_FORMAT) if next_task is not None else None
    return JsonResponse({"completed_time": current_task.completed_on.strftime(TASK_DATE_FORMAT),
                         "start_time": start_time})


def task_status(request, task_id):
    status = UserTask.objects.get(id=task_id).item.task_status()
    return JsonResponse({"status": status})


# TODO tasks need to be updated when item information changes


# proofs


def proofs_upload(request, order_id: int):
    file = save_request_file(request.FILES["Upload"])
    order: models.Order = models.Order.objects.get(id=order_id)
    order.proofs.files.add(file)
    order.proofs.save()
    return JsonResponse({"file_name": file.short_name(), "file_id": file.id})


def proofs_edit(request, order_id: int):
    order: models.Order = models.Order.objects.get(id=order_id)
    order.proofs.notes = json.loads(request.body)["notes"]
    order.proofs.save()
    return HttpResponse(b"{}")
