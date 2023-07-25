import classNames from "classnames";
import { type } from "os";
import React from "react";
import { BackButton } from "./Icons";

function OrderSideButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  children: string;
  onClick?: () => any;
}) {
  const listClass = classNames("rounded-xl w-full", {
    "bg-sky-400 text-white translate-x-3": active,
    "hover:bg-sky-200 hover:translate-x-3 bg-white transition-transform duration-50 hover:text-gray-800":
      !active,
  });
  return (
    <li className={listClass} key={children.toString()} onClick={onClick}>
      <button className="flex w-100 items-center p-2 space-x-3 rounded-md">
        <span>{children}</span>
      </button>
    </li>
  );
}

type SideButtons = {
  name: string;
  onClick: () => void;
  active: boolean;
};

export default function Sidebar({
  header,
  href,
  navs,
  children,
}: {
  header: string;
  href: string;
  navs: Array<SideButtons>;
  children?: any;
}) {
  return (
    <div className="flex">
      <div className="flex flex-col h-screen p-3 shadow-gray-300 shadow w-60">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">
              <BackButton href={href}>{header}</BackButton>
            </h2>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-m">
              {navs.map((nav) => (
                <OrderSideButton
                  active={nav.active}
                  key={nav.name}
                  onClick={nav.onClick}
                >
                  {nav.name}
                </OrderSideButton>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-12">
        <div>{children}</div>
      </div>
    </div>
  );
}
