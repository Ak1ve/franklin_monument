import classNames from "classnames";
import Collapse from "./Collapse";
import { useState } from "react";
import StretchButton from "./StretchButton";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import { OrderItem, Order as OrderType } from "@/data/models/orders";
import { Data } from "@/data/schema";
import { orders } from "@/dummydata";

const orderList: Array<Data<typeof OrderType>> = orders;

function colorStatus(status: string) {
  return "color-" + status.toLowerCase().replaceAll(" ", "-");
}

function getPercent(item: Data<typeof OrderItem>[]) {
  return 4;
}

function Order({ order }: { order: Data<typeof OrderType> }) {
  const items = order.items.map((x) => (
    <FooterBadge key={x.id} className="bg-gray-200">
      {x.catalogedItem.type}
    </FooterBadge>
  ));
  const header = (
    <div className="flex">
      <HeaderBadge className={colorStatus(order.status)}>
        {order.status}
      </HeaderBadge>
      <a
        className="hover:text-sky-300 underline text-lg font-medium"
        href={`/orders/${order.id}`}
      >
        {order.overview.deceasedName}
      </a>
      <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
        {getPercent(order.items)}%
      </div>
    </div>
  );
  const leftSide = [
    <>Customer: {order.overview.customerContact?.name}</>,
    <>Phone: {order.overview.customerContact?.phoneNumber}</>,
    <>
      Email:
      <a className="underline ml-1" href="#">
        {order.overview.customerContact?.email}
      </a>
    </>,
    <>
      Website:
      <a className="underline ml-1" href="#">
        {order.overview.customerContact?.website}
      </a>
    </>,
  ];
  const rightSide = [
    <>Cemetery: {order.overview.cemetery.name}</>,
    <>
      Address:
      <a className="underline ml-1" href="#">
        {order.overview.cemetery.address}
      </a>
    </>,
  ];
  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      footer={<div className="flex gap-2 text-gray-600 text-sm">{items}</div>}
      header={header}
    />
  );
}

export default function OrderList() {
  const orderElements = orderList.map((x) => (
    <Order key={x as any} order={x} />
  ));
  const [visible, setVisible] = useState(false);
  return (
    <ListView searchPlaceholder="Search orders..." filter="Hello">
      {orderElements}
    </ListView>
  );
}
