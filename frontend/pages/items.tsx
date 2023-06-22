import Navbar from "@/components/Navbar";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import { CatalogedItem, ItemOption } from "@/models/CatalogedItem";
import { pool } from "@/utilities/api";

const catalogedItems: CatalogedItem[] = [
  {
    id: 1, type: "Monument", subType: "Memorial", description: "This is the description of the Cataloged Item.  It is used",
    commissionable: true, sizeable: true, isDeleted: false, tasks: [], options: [{
      id: 1, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    }]
  },
  {
    id: 2, type: "Base", subType: "Memorial", description: "This is the description of the Cataloged Item.  It is used.  BAHAHAH NOT",
    commissionable: true, sizeable: true, isDeleted: false, tasks: [], options: [{
      id: 1, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    }, {
      id: 3, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    },
    {
      id: 4, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    },
    {
      id: 5, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    },
    {
      id: 6, key: "Color", values: [], isDeleted: false, allowMulti: true, allowNull: false,
    }]
  },
]


export function ItemCard({ catalogedItem }: { catalogedItem: CatalogedItem }) {
  const options = catalogedItem.options.map((x) => (
    <FooterBadge key={x.id} className="bg-gray-200">{x.key}</FooterBadge>
  ));
  const header = (<div className="flex">
    <HeaderBadge className="bg-fuchsia-200 text-fuchsia-500">{catalogedItem.subType}</HeaderBadge>
    <a className="text-fuchsia-500 hover:text-fuchsia-300 underline text-lg font-medium" href={`/items/${catalogedItem.id}`}>
      {catalogedItem.type}
    </a>
  </div>);
  const leftSide = [<>{catalogedItem.description}</>
  ];
  const rightSide = [
    <>This item {pool(catalogedItem.commissionable)} commissionable</>,
    <>This item {pool(catalogedItem.sizeable)} sizeable</>
  ];
  const footer = (
    <div className="flex gap-2 text-gray-600 text-sm">
      {options}
      <a className="rounded-full px-2 color-active ml-auto hover:scale-105 trasition-all hover:cursor-pointer hover:underline" href={`/tasks/${catalogedItem.id}`}>{catalogedItem.tasks.length} tasks</a>
    </div>
  );
  return <ListCard leftFields={leftSide} rightFields={rightSide} footer={footer} header={header} />
}

export default function Items() {
  return (
    <div>
      <Navbar active="Items" />
      <ListView searchPlaceholder="Search cataloged items..." filter="Hello! :)">
        {catalogedItems.map(x => <ItemCard catalogedItem={x} key={x.id} />)}
      </ListView>
    </div>
  );
}
