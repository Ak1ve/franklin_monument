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
    <a
      className="hover:text-sky-300 underline text-lg font-medium"
      href={`/orders/${order.id}`}
    >
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
  return <ListCard leftFields={leftSide} rightFields={rightSide} footer={items} header={header} />
  /*
  return (
    <div className="order-card-primary" key={order.id as any}>
      <div className="flex">
        <span className={classNames("mr-2 badge", colorStatus(order.status))}>
          {order.status}
        </span>
        <a
          className="hover:text-sky-300 underline text-lg font-medium"
          href={`/orders/${order.id}`}
        >
          {order.deceased}
        </a>
        <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
          {order.tasks as any}%
        </div>
      </div>
      <div className="grid grid-cols-2 mx-3 my-2 text-gray-500 gap-3 text-sm w-full">
        <div className="divide-x-2 divide-purple-200">
          <div></div>
          <div className="pl-2">Customer: {order.customer.name}</div>
          <div className="pl-2">Phone: {order.customer.phone}</div>
          <div className="pl-2">
            Email:{" "}
            <a className="underline" href="#">
              {order.customer.email}
            </a>
          </div>
          <div className="pl-2">
            Webiste:{" "}
            <a className="underline" href="#">
              {order.customer.website}
            </a>
          </div>
        </div>
        <div className="divide-x-2 divide-purple-200">
          <div></div>
          <div className="pl-2">Cemetery: {order.cemetery.name}</div>
          <div className="pl-2">
            Address:{" "}
            <a className="underline" href="#">
              {order.cemetery.address}
            </a>
          </div>
        </div>
      </div>
      <div className="flex gap-2 text-gray-600 text-sm">{items}</div>
    </div>
  );
  */
}

export default function OrderList() {
  const orderElements = orders.map((x) => <Order key={x as any} order={x} />);
  const [visible, setVisible] = useState(false);
  /* <div className="gap-2 grid place-items-center my-4">
      <div className="mt-5 md:w-7/12 w-11/12 text-lg">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Orders..."
          />
          <button
            type="button"
            className="bg-sky-500 hover:bg-sky-600 text-gray-50 absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
        <StretchButton
          onClick={() => setVisible((x) => !x)}
          buttonClass="bg-sky-500 rounded-full text-gray-50 px-4"
        >
          Filter
        </StretchButton>
      </div>
      <Collapse visible={visible}>Hello there!</Collapse>
      {orderElements}
    </div>
    */
  return (
    <ListView searchPlaceholder="Search orders..." filter="Hello">
      {orderElements}
    </ListView>
  );
}
