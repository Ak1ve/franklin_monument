import Navbar from "@/components/Navbar";
import ListView, { FooterBadge, HeaderBadge } from "@/forms/ListView";
import { CatalogedItem, ItemOption } from "@/models/CatalogedItem";

const catalogedItems: CatalogedItem[] = [
  {id: 1, type: "Monument", subType: "Memorial", description: "This is the description of the Cataloged Item.  It is used",
  commissionable: true, sizeable: true, isDeleted: false, tasks: [{}, {}, {}], options: [{
    id: 1, key: "Color", values: [{}, {}, {}, {}], isDeleted: false, allowMulti: true, allowNull: false, 
  }]},
  {id: 2, type: "Base", subType: "Memorial", description: "This is the description of the Cataloged Item.  It is used.  BAHAHAH NOT",
  commissionable: true, sizeable: true, isDeleted: false, tasks: [{}, {}, {}], options: [{
    id: 1, key: "Color", values: [{}, {}, {}], isDeleted: false, allowMulti: true, allowNull: false, 
  }]},
]

export function optionProgressionColor(option: ItemOption) {
  let amt = option.values.length;
  const colorStrength = Math.max(Math.min(amt, 1), 9).toString() + "00";
  return `bg-sky-${colorStrength}`;
}

export function ItemCard({catalogedItem}: {catalogedItem: CatalogedItem}) {
  const items = catalogedItem.options.map((x) => (
    <FooterBadge key={x.id} className={optionProgressionColor(x)}>{x.key}</FooterBadge>
  ));
  const header = (<div className="flex">
    <HeaderBadge className="bg-sky-100">{catalogedItem.subType}</HeaderBadge>
    <a className="hover:text-sky-300 underline text-lg font-medium" href={`/items/${catalogedItem.id}`}>
      {catalogedItem.type}
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

export default function Items() {
  return (
    <div>
      <Navbar active="Items" />
      <ListView searchPlaceholder="Search cataloged items..." filter="Hello! :)">

      </ListView>
    </div>
  );
}
