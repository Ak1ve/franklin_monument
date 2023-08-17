import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import { BasicInput, BasicSelect, BasicTextArea } from "@/utilities/form";
import Base, { Section } from "../Base";
import { useImmer } from "use-immer";
import Navbar from "@/components/Navbar";
import { StandardModal } from "@/components/Modal";
import { useState } from "react";
import { CatalogedTask } from "@/models/Tasks";
import { EditButton, TrashButton } from "@/components/Icons";
import useWindowDimensions from "@/utilities/window";
import { catalogedTasks } from "@/dummydata";

export function TaskForm() {
  const task = useImmer({
    label: "Quinn Hipp",
    description: "The coolest guy",
    somethingBruh: "ello govenor"
  });

  const options = [
    { label: "Creation", value: "Creation" },
    { label: "All Tasks Completed", value: "All Tasks Completed" },
    { label: "Task 1", value: "Task 1" },
    { label: "Task 2", value: "Task 2" },
  ];

  return (
    <>
      <InputGrid>
        <BasicInput prop="label" label="Label" hook={task} />
        <BasicTextArea prop="description" label="Description" hook={task} />
      </InputGrid>
      <BasicSelect prop="somethingBruh" label="QCH" options={options} isMultiple={true} hook={task} />
    </>
  );
}

// const tasks: Array<CatalogedTask> = [
//   {
//     id: "1",
//     label: "Task 1",
//     description: "This is how you do task 1",
//     isDeleted: false,
//   },
//   {
//     id: "2",
//     label: "Task 2",
//     description: "This is how you do task 2",
//     isDeleted: false,
//   },
//   {
//     id: "3",
//     label: "Task 3",
//     description: "This is how you do task 3",
//     isDeleted: false,
//   },
//   {
//     id: "4",
//     label: "Task 4",
//     description: "This is how you do task 4",
//     isDeleted: false,
//   },
// ];
const tasks = catalogedTasks;

export function TaskCard({
  task,
  onClick,
}: {
  task: CatalogedTask;
  onClick: any;
}) {
  return (
    <Section className="mt-5">
      <div className="flex">
        <div className="text-green-400 text-xl">{task.label}</div>
        <EditButton addClass="ml-auto" title="Edit Task" onClick={onClick} />
        <TrashButton title="Delete Task" />
      </div>
      <div className="text-gray-400 text-sm mt-5">
        Description: {task.description}
      </div>
    </Section>
  );
}

export default function TaskList(this: any) {
  const [showModal, setShowModal] = useState(false);

  const onSubmit = () => {};

  const onCancel = () => {
    setShowModal(false);
  };

  const taskElements = tasks.map((x) => (
    <TaskCard key={x as any} task={x} onClick={setShowModal} />
  ));

  const { height, width } = useWindowDimensions();

  return (
    <div>
      <StandardModal
        showModal={showModal}
        title="Edit Task"
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <TaskForm />
      </StandardModal>
      <div className="flex justify-center">
        <StandardButton
          type={ButtonTypes.ACTIVE}
          className="text-center mt-5"
          onClick={() => setShowModal(true)}
        >
          New Item
        </StandardButton>
      </div>
      {!showModal && (
        <div style={{ width: 1000, margin: "0 auto" }}>
            {tasks.map((x) => (
              <TaskCard key={x as any} task={x} onClick={setShowModal} />
            ))}
        </div>
      )}
    </div>
  );
}
