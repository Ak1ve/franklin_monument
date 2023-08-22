import Navbar from "@/components/Navbar";
import { User } from "@/data/models/user";
import { Data } from "@/data/schema";
import { users } from "@/dummydata";
import ListView, { FooterBadge, HeaderBadge, ListCard } from "@/forms/ListView";
import { useState } from "react";

function colorStatus(status: string) {
  return "color-" + status.toLowerCase().replaceAll(" ", "-");
}

export function UserCard({
  user,
  onClick,
}: {
  user: Data<typeof User>;
  onClick: any;
}) {
  const header = (
    <div className="flex">
      <HeaderBadge className={colorStatus("Active")}>{"Active"}</HeaderBadge>
      <a
        className="hover:text-sky-300 underline text-lg font-medium"
        href={`/users/${user.id}`}
      >
        {user.userName}
      </a>
      <div className="ml-auto text-green-700 bg-green-200 rounded-full px-2.5">
        {"50" as any}%
      </div>
    </div>
  );
  const leftSide = [<>ID: {user.id} </>];
  const rightSide = [<>UserName: {user.userName}</>];

  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      header={header}
    ></ListCard>
  );
}

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  const userList = users;

  const userElements = userList.map((x) => (
    <UserCard key={x as any} user={x} onClick={setShowModal} />
  ));
  return (
    <>
      <Navbar active="Users" />
      <ListView searchPlaceholder="Search users..." filter="Hello">
        {userElements}
      </ListView>
    </>
  );
}
