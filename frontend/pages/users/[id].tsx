import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AssignableTasks from "@/forms/users/AssignableTasks";
import { useState } from "react";

export default function UserView() {
  const [body, setBody] = useState("Assignable Tasks");
  const bodyNav = (name: string) => {
    return { name: name, onClick: () => setBody(name), active: body === name };
  };
  const navs = [
    bodyNav("Assignable Tasks"),
    bodyNav("Permissions"),
    bodyNav("Current Tasks"),
    bodyNav("Information"),
    bodyNav("Admin"),
  ];

  let bodyContent;
  if (body === "Assignable Tasks") {
    bodyContent = <AssignableTasks />;
    //   } else if (body === "Permissions") {
    //     bodyContent = <Permissions />;
    //   } else if (body === "CurrentTasks") {
    //     bodyContent = <CurrentTasks />;
    //   } else if (body === "Information") {
    //     bodyContent = <Information />;
    //   } else if (body === "Admin") {
    //     bodyContent = <Admin />;
  } else {
    bodyContent = <></>;
  }
  return (
    <div className="overflow-x-clip">
      <Navbar active="****" />
      <Sidebar header="Username" href="/users" navs={navs}>
        {bodyContent}
      </Sidebar>
    </div>
  );
}
