import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import { BasicInput, BasicSelect, BasicTextArea } from "@/utilities/form";
import { Section } from "../Base";
import { useImmer } from "use-immer";
import { StandardModal } from "@/components/Modal";
import { useState } from "react";
import { EditButton, TrashButton } from "@/components/Icons";
import { catalogedTasks } from "@/dummydata";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";

export function TaskForm() {
  const task = useImmer({
    label: "Quinn Hipp",
    description: "The coolest guy",
    somethingBruh: "ello govenor",
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
      <BasicSelect
        prop="somethingBruh"
        label="QCH"
        options={options}
        isMultiple={true}
        hook={task}
      />
    </>
  );
}

export function TaskCard({
  task,
  onClick,
}: {
  task: any;
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
  const [tasks, setTasks] = useState(catalogedTasks);

  const onSubmit = () => {};

  const onCancel = () => {
    setShowModal(false);
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setTasks((array) => arrayMove(array, oldIndex, newIndex));
  };

  return (
    <div className="select-none">
      <StandardModal
        showModal={showModal}
        title="Edit Task"
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <TaskForm />
      </StandardModal>
      <div className="flex justify-center gap-4 w-full">
        <StandardButton
          type={ButtonTypes.ACTIVE}
          className="text-center mt-5"
          onClick={() => setShowModal(true)}
        >
          New Task
        </StandardButton>
        <StandardButton
          type={ButtonTypes.STANDARD}
          className="text-center mt-5"
          onClick={() => {}}
        >
          Save
        </StandardButton>
      </div>
      {!showModal && (
        <div style={{ width: 1000, margin: "0 auto" }}>
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged"
          >
            {tasks.map((x) => (
              <SortableItem key={x.id}>
                <div className="item">
                  <TaskCard task={x} onClick={setShowModal} />
                </div>
              </SortableItem>
            ))}
          </SortableList>
        </div>
      )}
    </div>
  );
}
