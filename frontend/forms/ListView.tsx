import Collapse from "@/components/Collapse";
import StretchButton from "@/components/StretchButton";
import classNames from "classnames";
import { useState } from "react";


export interface ListCardProps {
  leftFields?: React.ReactNode[]
  rightFields?: React.ReactNode[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function FooterBadge({ children, className }: { children?: any, className?: string }) {
  return (
    <span className={"rounded-full px-2 " + className}>
      {children}
    </span>);
}

export function HeaderBadge({ children, className }: { children?: any, className?: string }) {
  return (<span className={"mr-2 badge" + className}>
    {children}
  </span>);
}

export function ListCard(props: ListCardProps) {
  return (
    <div className="order-card-primary">
      {props.header}
      <div className="grid grid-cols-2 mx-3 my-2 text-gray-500 gap-3 text-sm w-full">
        <div className="divide-x-2 divide-purple-200">
          <div></div>
          {props.leftFields?.map(x => <div className="pl-2" key={x?.toString()}>{x}</div>)}
        </div>
        <div className="divide-x-2 divide-purple-200">
          <div></div>
          {props.rightFields?.map(x => <div className="pl-2" key={x?.toString()}>{x}</div>)}
        </div>
      </div>
      {props.footer}
    </div>);
}

export default function ListView({ children, searchPlaceholder, filter }: { children: React.ReactNode, searchPlaceholder: string, filter: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="gap-2 grid place-items-center my-4">
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
            placeholder={searchPlaceholder}
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
      <Collapse visible={visible}>{filter}</Collapse>
      {children}
    </div>
  );
}
