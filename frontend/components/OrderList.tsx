import classNames from "classnames";
import Collapse from "./Collapse";
import { useState } from "react";
import StretchButton from "./StretchButton";
import ListView, { ListCard } from "@/forms/ListView";

type CemeteryType = {
  id: Number;
  address: string;
  name: string;
};

type OrderType = {
  id: Number;
  deceased: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    website: string;
  };
  items: Array<string>;
  tasks: Number;
  cemetery: CemeteryType;
};

const orders: Array<OrderType> = [
  {
    id: 1,
    deceased: "Austin Rockwell",
    status: "Active",
    customer: {
      name: "Austin Rockwell",
      email: "rockwell.ausin04@gmail.com",
      phone: "419-706-5906",
      website: "https://www.google.com",
    },
    items: ["Monument", "Base", "Lasering"],
    tasks: 50,
    cemetery: {
      id: 1,
      address: "4295 Ferris Ln Norwalk, OH",
      name: "Franklin Monument",
    },
  },
  {
    id: 2,
    deceased: "Kevin Rockwell",
    status: "Ready To Invoice",
    customer: {
      name: "Steve Johnson",
      email: "rockwell.ausin04@gmail.com",
      phone: "419-706-5906",
      website: "https://www.yahoo.com",
    },
    items: ["Lasering"],
    tasks: 80,
    cemetery: {
      id: 1,
      address: "4295 Ferris Ln Norwalk, OH",
      name: "Franklin Monument",
    },
  },
];

function colorStatus(status: string) {
  return "color-" + status.toLowerCase().replaceAll(" ", "-");
}

function Order({ order }: { order: OrderType }) { 
  const items = order.items.map((x) => (
    <span key={x} className="bg-gray-200 rounded-full px-2">
      {x}
    </span>
  ));
  const header = (<div className="flex">
    <span className={classNames("mr-2 badge", colorStatus(order.status))}>
      {order.status}
    </span>
    <a className="hover:text-sky-300 underline text-lg font-medium" href={`/orders/${order.id}`}>
      {order.deceased}
    </a>
    <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
      {order.tasks as any}%
    </div>
  </div>);
  const leftSide = [
    <>Customer: {order.customer.name}</>,
    <>Phone: {order.customer.phone}</>,
    <>Email:<a className="underline ml-1" href="#">{order.customer.email}</a></>,
    <>Website:<a className="underline ml-1" href="#">{order.customer.email}</a></>,
  ];
  const rightSide = [
    <>Cemetery: {order.cemetery.name}</>,
    <>Address:<a className="underline ml-1" href="#">{order.cemetery.address}</a></>
  ];
  return <ListCard leftFields={leftSide} rightFields={rightSide} footer={<div className="flex gap-2 text-gray-600 text-sm">{items}</div>} header={header} />
}

export default function OrderList() {
  const orderElements = orders.map((x) => <Order key={x as any} order={x} />);
  const [visible, setVisible] = useState(false);
  return (
    <ListView searchPlaceholder="Search orders..." filter="Hello">
      {orderElements}
    </ListView>
  );
}
