import Navbar from "@/components/Navbar";
import { StandardConfirm, StandardImportantConfirm } from "@/components/message";
import Base, { Section } from "@/forms/Base";
import { useState } from "react";
import { Chart } from "react-google-charts";

export default function Dashboard() {
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 8],
    ["Eat", 2],
    ["Commute", 1],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    title: "My Daily Activities",
    pieHole: 0.4,
  };

  const [show, setShow] = useState(true);

  return (
    <div>
      <Navbar active="Dashboard" />
      <Base sectionHeader="Dashboard">
        {
          show ?
        (<StandardImportantConfirm title="Are you sure you want to delete this item?" onConfirm={() => console.log("CONFIRMED!!")} onCancel={() => setShow(false)}
          confirm="Delete Item"
        >
          Are you sure you want to delete this item?  Doing so will result in irreversible changes that cannot be undone.
        </StandardImportantConfirm>) : <></>
        }
        <Section className="mt-10 cursor-default">
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </Section>
      </Base>
    </div>
  );
}
