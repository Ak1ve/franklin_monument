import Navbar from "@/components/Navbar";
import { CatalogedItem } from "@/data/models/items";
import { Data } from "@/data/schema";
import { catalogedItems } from "@/dummydata";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import { pool } from "@/utilities/api";

const catalogedItemList: Array<Data<typeof CatalogedItem>> = catalogedItems;

export function ItemCard({
  catalogedItem,
}: {
  catalogedItem: Data<typeof CatalogedItem>;
}) {
  const options = catalogedItem.options.map((x) => (
    <FooterBadge key={x.id} className="bg-gray-200">
      {x.key}
    </FooterBadge>
  ));
  const header = (
    <div className="flex">
      <HeaderBadge className="bg-fuchsia-200 text-fuchsia-500">
        {catalogedItem.subType}
      </HeaderBadge>
      <a
        className="text-fuchsia-500 hover:text-fuchsia-300 underline text-lg font-medium"
        href={`/items/${catalogedItem.id}`}
      >
        {catalogedItem.type}
      </a>
    </div>
  );
  const leftSide = [<>{catalogedItem.description}</>];
  const rightSide = [
    <>This item {pool(catalogedItem.commissionable)} commissionable</>,
    <>This item {pool(catalogedItem.sizeable)} sizeable</>,
  ];
  const footer = (
    <div className="flex gap-2 text-gray-600 text-sm">
      {options}
      <a
        className="rounded-full px-2 color-active ml-auto hover:scale-105 trasition-all hover:cursor-pointer hover:underline"
        href={`/tasks/${catalogedItem.id}`}
      >
        {catalogedItem.tasks.length} tasks
      </a>
    </div>
  );
  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      footer={footer}
      header={header}
    />
  );
}

export default function Items() {
  return (
    <div>
      <Navbar active="Items" />
      <ListView
        searchPlaceholder="Search cataloged items..."
        filter="Hello! :)"
      >
        {catalogedItemList.map((x) => (
          <ItemCard catalogedItem={x} key={x.id} />
        ))}
      </ListView>
    </div>
  );
}
