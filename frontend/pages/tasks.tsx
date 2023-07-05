import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Base, { Section } from "@/forms/Base";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { Address } from "@/models/Address";
import { CatalogedItem, ItemOption } from "@/models/CatalogedItem";
import { CatalogedTask } from "@/models/Tasks";
import classNames from "classnames";
import { useState } from "react";

function colorStatus(status: string) {
  return "color-" + status.toLowerCase().replaceAll(" ", "-");
}

export function TaskCard({
  item,
  onClick,
}: {
  item: CatalogedItem;
  onClick: any;
}) {
  const items = item.tasks.map((x) => (
    <FooterBadge key={x.id} className="color-active">
      {x.label}
    </FooterBadge>
  ));

  const header = (
    <div className="flex">
      <HeaderBadge className={colorStatus("Active")}>{"Joe"}</HeaderBadge>
      <a
        className="hover:text-sky-300 underline text-lg font-medium"
        href={`/tasks/${item.id}`}
      >
        {"Mama"}
      </a>
      <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
        {"Yo" as any}%
      </div>
    </div>
  );
  const leftSide = [
    <>Type: {item.type}</>,
    <>Subtype: {item.subType}</>,
    <>Description: {item.description} </>,
  ];
  const rightSide = [<>Description: {item.description}</>];

  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      footer={<div className="flex gap-2 text-gray-600 text-sm">{items}</div>}
      header={header}
    ></ListCard>
  );
}

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);

  const onSubmit = () => {};

  const onCancel = () => {
    setShowModal(false);
  };

  const catalogedTask: Array<CatalogedTask> = [
    {
      id: 1,
      label: "Label",
      description: "Description",
      isDeleted: false,
    },
    {
      id: 2,
      label: "Label2",
      description: "Description2",
      isDeleted: false,
    },
  ];

  const items: Array<CatalogedItem> = [
    {
      id: 5,
      type: "Type",
      subType: "Subtype",
      description: "Description",
      commissionable: true,
      sizeable: true,
      options: [],
      tasks: catalogedTask,
      isDeleted: false,
    },
  ];
  const taskElements = items.map((x) => (
    <TaskCard key={x as any} item={x} onClick={setShowModal} />
  ));

  return (
    <div>
      <Navbar active="Tasks" />
      <StandardModal
        showModal={showModal}
        title=""
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <AddressForm />
      </StandardModal>
      <ListView searchPlaceholder="Search orders..." filter="Hello">
        {taskElements}
      </ListView>
    </div>
  );
}
