import { BasicTextArea } from "@/utilities/form";
import Base, { Section } from "../Base";
import FileUpload from "@/components/FileUpload";
import { useImmer } from "use-immer";

export default function Documents() {
  const docs = useImmer({
    notes: "N/A",
  });
  return (
    <Base sectionHeader="Documents">
      <FileUpload />
      <Section className="mt-10">
        <BasicTextArea prop= "notes" label= "Notes" hook={docs} />
      </Section>
    </Base>
  );
}
