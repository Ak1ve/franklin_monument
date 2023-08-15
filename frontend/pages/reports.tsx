import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Report } from "@/data/models/reports";
import Base, { Section } from "@/forms/Base";
import { BasicDatepicker } from "@/utilities/form";
import { Component, useState } from "react";
import { ImmerHook, useImmer } from "use-immer";
import { Chart } from "react-google-charts";
import { dateRange } from "@/utilities/api";
import { any } from "zod";

export const ReportHeader = ({ reportHook, onClick }: any) => {
  return (
    <Section className="mt-10">
      <h2 className="section-header mb-5 mt-2">Select a Start and End Date</h2>
      <InputGrid>
        <BasicDatepicker
          type="month"
          label="Start Date"
          hook={reportHook}
          prop="startDate"
        />
        <BasicDatepicker
          type="month"
          label="End Date"
          hook={reportHook}
          prop="endDate"
        />
      </InputGrid>
      <div className="flex gap-2 pb-2">
        <StandardButton
          type={ButtonTypes.ACTIVE}
          className="ml-auto"
          onClick={onClick}
        >
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
  const reportHook = useImmer({
    startDate: "2023-01",
    endDate: "2023-01",
  });

  const financialSummaryData = {
    monthlySummary: [
      ["", ""],
      ["Jan 2023", 7216],
      ["Feb 2023", 1294],
      ["Mar 2023", 8274],
      ["Apr 2023", 2849],
      ["May 2023", 2843],
      ["Jun 2023", 2094],
      ["Jul 2023", 4274],
      ["Aug 2023", 5424],
      ["Sep 2023", 3850],
      ["Oct 2023", 3235],
      ["Nov 2023", 2922],
      ["Dec 2023", 4575],
      ["Jan 2024", 7216],
      ["Feb 2024", 1294],
      ["Mar 2024", 8274],
      ["Apr 2024", 3749],
      ["May 2024", 2843],
      ["Jun 2024", 2094],
      ["Jul 2024", 4274],
      ["Aug 2024", 5424],
      ["Sep 2024", 3850],
      ["Oct 2024", 3235],
      ["Nov 2024", 2922],
      ["Dec 2024", 4575],
    ],
    totalPayments: { quantity: 29, amount: 51306 },
    numberOfOrders: [
      ["", ""],
      ["Paid", 36],
      ["Unpaid", 20],
    ],
  };

  const onClick = () => {
    // let data = [["", ""]];
    // range = dateRange(reportHook[0].startDate, reportHook[0].endDate);
    // range.forEach((rangeElement) => {
    //   dummyData.forEach((dataElement) => {
    //     if (rangeElement === dataElement[0]) {
    //       data.push(dataElement as any);
    //     }
    //   });
    // });
    // setDisplayData(data);
  };

  const monthlyOptions = {
    chart: {
      title: "Revenue Breakdown",
      subtitle: "",
    },
    hAxis: {
      title: "Total Revenue",
      minValue: 0,
    },
    vAxis: {
      title: "Month",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "left" },
      },
    },
  };

  const orderPaidOptions = {
    legend: "none",
    pieSliceText: "label",
    title: "# Orders Paid by end date vs # Orders Not finished Paid",
    slices: {
      0: { color: "green" },
      1: { color: "orange" },
    },
  };

  const itemOptions = {
    chart: {
      title: "Revenue By Cataloged Item",
      subtitle: "",
    },
    hAxis: {
      title: "Total Revenue",
      minValue: 0,
    },
    vAxis: {
      title: "Month",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "left" },
      },
    },
  };

  const subtypeOptions = {
    chart: {
      title: "Revenue By Cataloged Item Subtype",
      subtitle: "",
    },
    hAxis: {
      title: "Total Revenue",
      minValue: 0,
    },
    vAxis: {
      title: "Month",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "left" },
      },
    },
  };

  return (
    <Base sectionHeader="Financial Summary">
      <ReportHeader reportHook={reportHook} onClick={onClick} />
      <div className="rounded-lg mt-10 p-2">
        <div className="mt-5 mb-5 p-10 bg-white shadow-md rounded-md">
          <Chart
            chartType="Bar"
            width="100%"
            height={`${Math.max(
              financialSummaryData.monthlySummary.length * 30,
              150
            )}px`}
            data={financialSummaryData.monthlySummary}
            options={monthlyOptions}
            key={financialSummaryData.monthlySummary.toString()}
          />
          <div className="flex gap-10 mt-10 shadow-md text-2xl justify-between rounded-md">
            <p>
              Total # of payments: {financialSummaryData.totalPayments.quantity}
            </p>
            <p>Total: ${financialSummaryData.totalPayments.amount}</p>
            <p>
              Outstanding Revenue: ${financialSummaryData.totalPayments.amount}
            </p>
          </div>
          <div className="mt-3"></div>
          <div className="mt-10 items-end">
            <Chart
              chartType="PieChart"
              options={orderPaidOptions}
              data={financialSummaryData.numberOfOrders}
              key={financialSummaryData.numberOfOrders.toString()}
            />
          </div>
          <div className="mt-10">
            <Chart
              chartType="Bar"
              width="100%"
              height={`${Math.max(
                financialSummaryData.monthlySummary.length * 30,
                150
              )}px`}
              data={financialSummaryData.monthlySummary}
              options={itemOptions}
              key={financialSummaryData.monthlySummary.toString()}
            />
          </div>
          <div className="mt-10">
            <Chart
              chartType="Bar"
              width="100%"
              height={`${Math.max(
                financialSummaryData.monthlySummary.length * 30,
                150
              )}px`}
              data={financialSummaryData.monthlySummary}
              options={subtypeOptions}
              key={financialSummaryData.monthlySummary.toString()}
            />
          </div>
        </div>
      </div>
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
