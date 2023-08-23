import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Base, { Section } from "@/forms/Base";
import { BasicDatepicker } from "@/utilities/form";
import { Component, useState } from "react";
import { ImmerHook, useImmer } from "use-immer";
import { Chart } from "react-google-charts";
import { dateRange } from "@/utilities/api";
import { any } from "zod";
import { listCard } from "@/utilities/listcard";
import { FinancialReport } from "@/data/models/reports";
import { Data } from "@/data/schema";

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
  const reportHook = useImmer({
    startDate: "2023-01",
    endDate: "2023-01",
  });

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

  return (
    <Base sectionHeader="User Tasks Report">
      <ReportHeader reportHook={reportHook} onClick={onClick} />
      <div className="rounded-lg mt-10 p-2">
        <div className="mt-5 mb-5 p-10 bg-white shadow-md rounded-md">
          <div className="flex gap-10 mt-10 shadow-md text-2xl justify-between rounded-md">
            <p># Finished: 12</p>
            <p># Completed: 18</p>
            <p># Not Done: 47</p>
          </div>
        </div>
      </div>
    </Base>
  );
}

export function FinancialSummaryData({
  data,
}: {
  data: Data<typeof FinancialReport>;
}) {
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
    <div className="mt-5 mb-5 p-10 bg-white shadow-md rounded-md">
      <Chart
        chartType="Bar"
        width="100%"
        height={`${Math.max(data.monthlySummary.length * 30, 150)}px`}
        data={data.monthlySummary}
        options={monthlyOptions}
        key={data.monthlySummary.toString()}
      />
      <div className="flex gap-10 mt-10 shadow-md text-2xl justify-between rounded-md">
        <p>Total # of payments: {data.totalPayments.quantity}</p>
        <p>Total: ${data.totalPayments.amount}</p>
        <p>Outstanding Revenue: ${data.totalPayments.amount}</p>
      </div>
      <div className="mt-3"></div>
      <div className="mt-10 items-end">
        <Chart
          chartType="PieChart"
          options={orderPaidOptions}
          data={data.numberOfOrders}
          key={data.numberOfOrders.toString()}
        />
      </div>
      <div className="mt-10">
        <Chart
          chartType="Bar"
          width="100%"
          height={`${Math.max(data.monthlySummary.length * 30, 150)}px`}
          data={data.monthlySummary}
          options={itemOptions}
          key={data.monthlySummary.toString()}
        />
      </div>
      <div className="mt-10">
        <Chart
          chartType="Bar"
          width="100%"
          height={`${Math.max(data.monthlySummary.length * 30, 150)}px`}
          data={data.monthlySummary}
          options={subtypeOptions}
          key={data.monthlySummary.toString()}
        />
      </div>
    </div>
  );
}

const FinancialSummary = listCard(
  FinancialReport,
  ({
    data,
    isLoading,
    refresh,
    query,
    loadingMessage,
    isError,
    errorMessage,
  }) => {
    const [showReport, setShowReport] = useState(false);
    const reportHook = useImmer({
      startDate: "",
      endDate: "",
    });
    const onClick = () => {
      query((query) => ({ ...query, ...reportHook[0] })).then((x) => {
        setShowReport(true);
        refresh();
      });
    };
    if (isError) {
      return errorMessage;
    }
    return (
      <Base sectionHeader="Financial Summary">
        <ReportHeader reportHook={reportHook} onClick={onClick} />
        <div className="rounded-lg mt-10 p-2">
          {isLoading && showReport && loadingMessage}
          {!isLoading && showReport && <FinancialSummaryData data={data} />}
        </div>
      </Base>
    );
  },
  false,
  false
);

export function OrderReport() {
  const reportHook = useImmer({
    startDate: "2023-01",
    endDate: "2023-01",
  });

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

  const orderOptions = {
    legend: "none",
    pieSliceText: "label",
    title: "# Orders by Status",
    slices: {
      0: { color: "blue" },
      1: { color: "skyblue" },
      2: { color: "#42A5F5" },
      3: { color: "royalblue" },
    },
  };

  const orderData = {
    totalOrders: 29,
    ordersByStatus: [
      ["", ""],
      ["Not Started", 36],
      ["In Progress", 15],
      ["Completed", 43],
    ],
    ordersByType: [
      ["", ""],
      ["Service", 13],
      ["Memorial", 5],
      ["Invoice", 21],
    ],
    ordersByCemetary: [
      ["", ""],
      ["Pet Cemetary", 7],
      ["Fisher Titus", 11],
      ["Loserville", 4],
    ],
    ordersByDeliveryMethod: [
      ["", ""],
      ["FedEx", 13],
      ["UPS", 9],
      ["USPS", 3],
      ["Pigeon", 10],
    ],
  };

  return (
    <Base sectionHeader="Order Report">
      <ReportHeader reportHook={reportHook} onClick={onClick} />
      <div className="rounded-lg mt-10 p-2">
        <div className="mt-5 mb-5 p-10 bg-white shadow-md rounded-md">
          <div className="flex gap-10 mt-5 shadow-md text-2xl justify-center rounded-md">
            <p># of orders: {orderData.totalOrders}</p>
          </div>
          <div className="mt-10">
            <div className="mt-10 flex justify-center">
              <Chart
                chartType="PieChart"
                options={orderOptions}
                data={orderData.ordersByStatus}
              />
              <Chart
                chartType="PieChart"
                options={orderOptions}
                data={orderData.ordersByType}
              />
            </div>
            <div className="mt-10 flex justify-center">
              <Chart
                chartType="PieChart"
                options={orderOptions}
                data={orderData.ordersByCemetary}
              />
              <Chart
                chartType="PieChart"
                options={orderOptions}
                data={orderData.ordersByDeliveryMethod}
              />
            </div>
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
    bodyNav("Order Report"),
  ];

  let bodyContent;
  if (body === "User Report") {
    bodyContent = <UserReport />;
  } else if (body === "Financial Summary") {
    bodyContent = <FinancialSummary />;
  } else if (body === "Home") {
    bodyContent = <Home />;
  } else if (body === "Order Report") {
    bodyContent = <OrderReport />;
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
