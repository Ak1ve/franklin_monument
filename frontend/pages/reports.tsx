import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Report } from "@/data/models/reports";
import Base, { Section } from "@/forms/Base";
import { BasicDatepicker } from "@/utilities/form";
import { useState } from "react";
import { useImmer } from "use-immer";

const ReportHeader = () => {
  const reportHook = useImmer({
    startDate: new Date("01/01/2000"),
    endDate: new Date("01/01/2000"),
  });
  return (
    <Section className="mt-10">
      <h2 className="section-header mb-5 mt-2">Select a Start and End Date</h2>
      <InputGrid>
        <BasicDatepicker
          label="Start Date"
          hook={reportHook}
          prop="startDate"
        />
        <BasicDatepicker label="End Date" hook={reportHook} prop="endDate" />
      </InputGrid>
      <div className="flex gap-2 pb-2">
        <StandardButton type={ButtonTypes.ACTIVE} className="ml-auto">
          Load
        </StandardButton>
        <StandardButton type={ButtonTypes.STANDARD}>Export</StandardButton>
      </div>
    </Section>
  );
};

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

export function FinancialSummary() {
  return (
    <Base sectionHeader="Financial Summary">
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
    bodyNav("Financial Summary"),
  ];

  let bodyContent;
  if (body === "User Report") {
    bodyContent = <UserReport />;
  } else if (body === "Financial Summary") {
    bodyContent = <FinancialSummary />;
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
