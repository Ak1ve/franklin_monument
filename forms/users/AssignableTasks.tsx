import { InputGrid, StandardCheckbox } from "@/components/Inputs";
import Base, { Section } from "../Base";

export default function AssignableTasks() {
  return (
    <Base sectionHeader="Assignable Tasks">
      <Section className="mt-10">
        <h2 className="section-header mb-5">Big Headstone</h2>
        <InputGrid>
          <StandardCheckbox id={"1"} label={"Task 1"}></StandardCheckbox>
          <StandardCheckbox id={"2"} label={"Task 2"}></StandardCheckbox>
          <StandardCheckbox id={"3"} label={"Task 3"}></StandardCheckbox>
        </InputGrid>
        <InputGrid>
          <StandardCheckbox id={"4"} label={"Task 4"}></StandardCheckbox>
          <StandardCheckbox id={"5"} label={"Task 5"}></StandardCheckbox>
          <StandardCheckbox id={"6"} label={"Task 6"}></StandardCheckbox>
        </InputGrid>
      </Section>
    </Base>
  );
}
