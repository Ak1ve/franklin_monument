import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Base, { Section } from "@/forms/Base";
import { BasicDatepicker, BasicSelect } from "@/utilities/form";
import { Component, useState } from "react";
import { ImmerHook, useImmer } from "use-immer";
import { Chart } from "react-google-charts";
import { dateRange } from "@/utilities/api";
import { any } from "zod";
import { listCard } from "@/utilities/listcard";
import {
  TaskReport,
  FinancialReport,
  OrderReport,
  UserTasksReport,
} from "@/data/models/reports";
import { Data } from "@/data/schema";

export const ReportHeader = ({ reportHook, onClick }: any) => {
  const users = [
    { label: "Quinn", value: "1" },
    { label: "Austin", value: "2" },
  ];

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
      {reportHook[0].userId !== undefined && (
        <div>
          <BasicSelect
            hook={reportHook}
            prop="userId"
            options={users}
            label={"User Select"}
          />
        </div>
      )}
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

export function TaskReportData({ data }: { data: Data<typeof TaskReport> }) {
  const taskOptions = {
    chart: {
      title: "Tasks in Progress",
      subtitle: "",
    },
    hAxis: {
      title: "Tasks",
      minValue: 0,
    },
    vAxis: {
      title: "Cataloged Tasks",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "left" },
      },
    },
  };

  const taskStatsOptions = {
    chart: {
      title: "Stats About Every Task",
      subtitle: "",
    },
    hAxis: {
      title: "Time in hours",
      minValue: 0,
    },
    vAxis: {
      title: "Task",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "left" },
      },
    },
  };

  const itemStatsOptions = {
    chart: {
      title: "Stats About Every Item",
      subtitle: "",
    },
    hAxis: {
      title: "Time",
      minValue: 0,
    },
    vAxis: {
      title: "Item",
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
        height={`${Math.max(data.currentTasks.length * 50, 150)}px`}
        data={data.currentTasks}
        options={taskOptions}
        key={data.currentTasks.toString()}
      />
      <div className="mt-10">
        <Chart
          chartType="Bar"
          width="100%"
          height={`${Math.max(data.taskStats.length * 80, 600)}px`}
          data={data.taskStats}
          options={taskStatsOptions}
          key={data.taskStats.toString()}
        />
      </div>
      <div className="mt-10">
        <Chart
          chartType="Bar"
          width="100%"
          height={`${Math.max(data.itemStats.length * 50, 300)}px`}
          data={data.itemStats}
          options={itemStatsOptions}
          key={data.itemStats.toString()}
        />
      </div>
    </div>
  );
}

const TasksReport = listCard(
  TaskReport,
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
      query((query) => ({ ...reportHook[0] })).then((x) => {
        setShowReport(true);
        refresh();
      });
    };
    if (isError) {
      return errorMessage;
    }

    return (
      <Base sectionHeader="Task Report">
        <ReportHeader reportHook={reportHook} onClick={onClick} />
        <div className="rounded-lg mt-10 p-2">
          {isLoading && showReport && loadingMessage}
          {!isLoading && showReport && <TaskReportData data={data} />}
        </div>
      </Base>
    );
  },
  false,
  false
);

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
      query((query) => ({ ...reportHook[0] })).then((x) => {
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

export function OrderReportData({ data }: { data: Data<typeof OrderReport> }) {
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

  return (
    <div className="mt-5 mb-5 p-10 bg-white shadow-md rounded-md">
      <div className="flex gap-10 mt-5 shadow-md text-2xl justify-center rounded-md">
        <p># of orders: {data.totalOrders}</p>
      </div>
      <div className="mt-10">
        <div className="mt-10 flex justify-center">
          <Chart
            chartType="PieChart"
            options={orderOptions}
            data={data.ordersByStatus}
          />
          <Chart
            chartType="PieChart"
            options={orderOptions}
            data={data.ordersByType}
          />
        </div>
        <div className="mt-10 flex justify-center">
          <Chart
            chartType="PieChart"
            options={orderOptions}
            data={data.ordersByCemetary}
          />
          <Chart
            chartType="PieChart"
            options={orderOptions}
            data={data.ordersByDeliveryMethod}
          />
        </div>
      </div>
    </div>
  );
}

const OrdersReport = listCard(
  OrderReport,
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
      query((query) => ({ ...reportHook[0] })).then((x) => {
        setShowReport(true);
        refresh();
      });
    };
    if (isError) {
      return errorMessage;
    }

    return (
      <Base sectionHeader="Order Report">
        <ReportHeader reportHook={reportHook} onClick={onClick} />
        <div className="rounded-lg mt-10 p-2">
          {isLoading && showReport && loadingMessage}
          {!isLoading && showReport && <OrderReportData data={data} />}
        </div>
      </Base>
    );
  }
);

export function UserTaskReportData({
  data,
}: {
  data: Data<typeof UserTasksReport>;
}) {
  const userTaskStatsOptions = {
    chart: {
      title: "Time to Complete Each Task",
      subtitle: "",
    },
    hAxis: {
      title: "Time",
      minValue: 0,
    },
    vAxis: {
      title: "Task",
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
      <div className="flex gap-10 mt-10 shadow-md text-2xl justify-between rounded-md">
        <p># of Tasks in Progress: {data.totalCurrentTasks}</p>
        <p># of Task Comments: {data.totalTaskComments}</p>
      </div>
      <div className="mt-10">
        <Chart
          chartType="Bar"
          width="100%"
          height={`${Math.max(data.userTaskStats.length * 50, 300)}px`}
          data={data.userTaskStats}
          options={userTaskStatsOptions}
          key={data.userTaskStats.toString()}
        />
      </div>
    </div>
  );
}

const UserTaskReport = listCard(
  UserTasksReport,
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
      userId: 0,
    });
    const onClick = () => {
      query((query) => ({ ...reportHook[0] })).then((x) => {
        setShowReport(true);
        refresh();
      });
    };
    if (isError) {
      return errorMessage;
    }

    return (
      <Base sectionHeader="User Tasks Report">
        <ReportHeader reportHook={reportHook} onClick={onClick} />
        <div className="rounded-lg mt-10 p-2">
          {isLoading && showReport && loadingMessage}
          {!isLoading && showReport && <UserTaskReportData data={data} />}
        </div>
      </Base>
    );
  },
  false,
  false
);

export default function Reports() {
  const [body, setBody] = useState("Home");
  const bodyNav = (name: string) => {
    return { name: name, onClick: () => setBody(name), active: body === name };
  };
  const navs = [
    bodyNav("Home"),
    bodyNav("Task Report"),
    bodyNav("Financial Summary"),
    bodyNav("Order Report"),
    bodyNav("User Tasks Report"),
  ];

  let bodyContent;
  if (body === "Task Report") {
    bodyContent = <TasksReport />;
  } else if (body === "Financial Summary") {
    bodyContent = <FinancialSummary />;
  } else if (body === "Home") {
    bodyContent = <Home />;
  } else if (body === "Order Report") {
    bodyContent = <OrdersReport />;
  } else if (body === "User Tasks Report") {
    bodyContent = <UserTaskReport />;
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
