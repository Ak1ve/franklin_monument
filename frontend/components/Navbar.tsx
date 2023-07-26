import { useState } from "react";
import { Kite, KiteButton } from "./Icons";

const navElements = [
  { title: "Dashboard", href: "dashboard" },
  { title: "Tasks", href: "tasks" },
  { title: "Items", href: "items" },
  { title: "Orders", href: "orders" },
  { title: "Address Book", href: "addressbook" },
  { title: "Users", href: "users" },
  { title: "Reports", href: "reports" },
];

export default function Navbar({ active = navElements[0].title }) {
  const selected = "md:px-4 md:py-2 text-sky-500";
  const unselected = "md:px-4 md:py-2 hover:text-sky-300";
  let navbarElements = navElements.map((navElement) => {
    const cls = active === navElement.title ? selected : unselected;
    return (
      <li className={cls} key={navElement.title}>
        <a href={"/" + navElement.href}>{navElement.title}</a>
      </li>
    );
  });

  return (
    <nav className="bg-gray-800 shadow shadow-gray-300 w-100 px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div className="text-sky-500 md:order-1 text-xl flex">
          <Kite width="40" height="40" iconClassName="justify-center" />
          <div className=" ml-4 justify-center text-center text-4xl">
            Monere
          </div>
        </div>
        <div className="text-gray-600 order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between">
            {navbarElements}
          </ul>
        </div>
        <div className="order-2 md:order-3">
          <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-gray-50 rounded-xl flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
