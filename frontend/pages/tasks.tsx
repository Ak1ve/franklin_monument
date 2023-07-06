import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Base, { Section } from "@/forms/Base";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { TaskForm } from "@/forms/tasks/Tasks";
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
      <HeaderBadge className={colorStatus("Active")}>
        {item.subType}
      </HeaderBadge>
      <a
        className="hover:text-sky-300 underline text-lg font-medium"
        href={`/tasks/${item.id}`}
      >
        {item.type}
      </a>
      <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
        {"Yo" as any}%
      </div>
    </div>
  );
  const leftSide = [<>Description: {item.description} </>];
  const rightSide = [""];

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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
      isDeleted: false,
    },
    {
      id: 2,
      label: "Label2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
      isDeleted: false,
    },
  ];

  const items: Array<CatalogedItem> = [
    {
      id: 5,
      type: "Type",
      subType: "Subtype",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
      commissionable: true,
      sizeable: true,
      options: [],
      tasks: catalogedTask,
      isDeleted: false,
    },
    {
      id: 2,
      type: "Type2",
      subType: "Subtype2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
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
        <TaskForm />
      </StandardModal>
      <ListView searchPlaceholder="Search orders..." filter="Hello">
        {taskElements}
      </ListView>
    </div>
  );
}
