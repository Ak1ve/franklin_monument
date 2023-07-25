import Navbar from "@/components/Navbar";
import Base, { Section } from "@/forms/Base";
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

  return (
    <div>
      <Navbar active="Dashboard" />
      <Base sectionHeader="Dashboard">
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
