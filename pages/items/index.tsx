import Navbar from "@/components/Navbar";
import { CatalogedItem } from "@/data/models/items";
import cs, { Data, standardRoute } from "@/data/schema";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import { pool } from "@/utilities/api";
import { listCard } from "@/utilities/listcard";
import { z } from "zod";

// const catalogedItemList: Array<Data<typeof CatalogedItem>> = catalogedItems;

interface ItemCardProps {
  catalogedItem: Data<typeof CatalogedItem>
}
export function ItemCard({catalogedItem}: ItemCardProps) {
  const options = catalogedItem.options.map((x) => (
    <FooterBadge key={x.id} className="bg-gray-200">
      {x.key}
    </FooterBadge>
  ));
  const header = (
    <div className="flex">
      <HeaderBadge className="bg-fuchsia-200 text-fuchsia-500">
        {catalogedItem.subtype}
      </HeaderBadge>
      <a
        className="text-fuchsia-500 hover:text-fuchsia-300 underline text-lg font-medium"
        href={`/items/${catalogedItem.id}`}
      >
        {catalogedItem.type}
      </a>
    </div>
  );
  const leftSide = [
    <>{catalogedItem.description}</>,
    <></>
  ];
  const rightSide = [
    <>This item {pool(catalogedItem.isCommissionable)} commissionable</>,
    <>This item {pool(catalogedItem.isSizeable)} sizeable</>,
  ];
  const footer = (
    <div className="flex gap-2 text-gray-600 text-sm">
      {options}
      <a
        className="rounded-full px-2 color-active ml-auto hover:scale-105 trasition-all hover:cursor-pointer hover:underline"
        href={`/tasks/${catalogedItem.id}`}
      >
        {catalogedItem.catalogedTasks.length} tasks
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

const ItemList = cs(z.array(CatalogedItem.schema), standardRoute(), null);

export default listCard(ItemList, ({ data, isLoading, isError, loadingMessage, errorMessage, refresh, router }) => {
  if (isError) {
    return isError;
  }

  if (isLoading) {
    return loadingMessage;
  }

  return (<>
    <Navbar active="Items" />
    <ListView searchPlaceholder="Search Cataloged Items..." filter="Hello!" onNew={() => router.push("/items/new")} title="Cataloged Items">
      {data.map(x => (
        <ItemCard catalogedItem={x} key={x.id} />
      ))}
    </ListView>
  </>);
}, true, true);