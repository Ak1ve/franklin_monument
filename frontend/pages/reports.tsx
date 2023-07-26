import { InputGrid } from "@/components/Inputs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Base, { Section } from "@/forms/Base";
import { basicDatepicker } from "@/utilities/form";
import { useState } from "react";
import { useImmer } from "use-immer";

export function ReportHeader() {
  const reportHook = useImmer("1/1/00");
  return (
    <Section className="mt-10">
      <h2 className="section-header mb-5 mt-2">Select a Start and End Date</h2>
      <InputGrid>
        {basicDatepicker({ id: "startDate", label: "Start Date" }, reportHook)}
        {basicDatepicker({ id: "endDate", label: "End Date" }, reportHook)}
      </InputGrid>
      <button
        type="button"
        className="bg-sky-500 hover:bg-sky-600 text-gray-50 w-fit focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2"
      >
        Update
      </button>
    </Section>
  );
}

export function Home() {
  return (
    <Base sectionHeader="Home">
      <Section className="mt-10 cursor-default">
        <h2 className="section-header mb-5">User Report</h2>
        <h2 className="mb-5">
          Generate a report of current users in the system.
        </h2>
      </Section>
      <Section className="mt-10 cursor-default">
        <h2 className="section-header mb-5">Finance Report</h2>
        <h2 className="mb-5">
          Generate a report of finances within a date range.
        </h2>
      </Section>
    </Base>
  );
}

export function UserReport() {
  return <div>User Report</div>;
}

export function FinanceReport() {
  return (
    <Base sectionHeader="Finance Report">
      <ReportHeader />
      HEYO
    </Base>
  );
}

export default function Reports() {
  const [body, setBody] = useState("Home");
  const bodyNav = (name: string) => {
    return { name: name, onClick: () => setBody(name), active: body === name };
  };
  const navs = [
    bodyNav("Home"),
    bodyNav("User Report"),
    bodyNav("Finance Report"),
  ];

  let bodyContent;
  if (body === "User Report") {
    bodyContent = <UserReport />;
  } else if (body === "Finance Report") {
    bodyContent = <FinanceReport />;
  } else if (body === "Home") {
    bodyContent = <Home />;
  } else {
    bodyContent = <></>;
  }

  return (
    <div>
      <Navbar active="Reports" />
      <Sidebar header="Reports" href="/reports" navs={navs}>
        {bodyContent}
      </Sidebar>
    </div>
  );
}
