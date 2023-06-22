import { InputGrid } from "@/components/Inputs";
import { basicInput, basicSelect, basicTextArea } from "@/utilities/form";
import options from "tailwind-datepicker-react/types/Options";
import { Section } from "../Base";
import { useImmer } from "use-immer";
import Navbar from "@/components/Navbar";
import { StandardModal } from "@/components/Modal";
import { useState } from "react";
import { CatalogedTask } from "@/models/Tasks";

export function TaskForm() {
  const task = useImmer({
    label: "Quinn Hipp",
    description: "The coolest guy",
  });

  return (
    <>
      <InputGrid>
        {basicInput({ id: "label", label: "Label" }, task)}
        {basicTextArea({ id: "description", label: "Description" }, task)}
      </InputGrid>
    </>
  );
}

export function TaskCard({
  task,
  onClick,
}: {
  task: CatalogedTask;
  onClick: any;
}) {
  return (
    <>
      <Section>
        <div>Label: {"Thing"}</div>
        <div>Description: {"Stuff"}</div>
      </Section>
    </>
  );
}

export default function TaskList() {
  const [showModal, setShowModal] = useState(false);

  const onSubmit = () => {};

  const onCancel = () => {
    setShowModal(false);
  };

  const tasks: Array<CatalogedTask> = [
    {
      id: "",
      label: "",
      description: "",
      isDeleted: false,
    },
    {
      id: "",
      label: "",
      description: "",
      isDeleted: false,
    },
  ];

  const taskElements = tasks.map((x) => (
    <TaskCard key={x as any} task={x} onClick={setShowModal} />
  ));

  return (
    <div>
      <Navbar active="Address Book" />
      <StandardModal
        showModal={showModal}
        title=""
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <TaskForm />
      </StandardModal>
      {taskElements}
    </div>
  );
}
