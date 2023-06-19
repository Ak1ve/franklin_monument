import { basicTextArea } from "@/utilities/form";
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
        {basicTextArea({ id: "notes", label: "Notes" }, docs)}
      </Section>
    </Base>
  );
}
