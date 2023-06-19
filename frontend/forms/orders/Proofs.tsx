import { basicTextArea } from "@/utilities/form";
import Base, { Section } from "../Base";
import FileUpload from "@/components/FileUpload";
import { useImmer } from "use-immer";

export default function Proofs() {
  const proofs = useImmer({
    notes: "N/A",
  });
  return (
    <Base sectionHeader="Based and Redpilled">
      <FileUpload />
      <Section className="mt-10">
        {basicTextArea({ id: "notes", label: "Notes" }, proofs)}
      </Section>
    </Base>
  );
}
