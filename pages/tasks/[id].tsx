import Navbar from "@/components/Navbar";
import TaskList from "@/forms/tasks/Tasks";

export default function TaskView() {
  return (
    <div className="overflow-x-clip">
      <Navbar active="****" />
      <TaskList />
    </div>
  );
}
