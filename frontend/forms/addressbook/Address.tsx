import { InputGrid } from "@/components/Inputs";
import { basicInput, basicSelect, basicTextArea } from "@/utilities/form";
import options from "tailwind-datepicker-react/types/Options";
import { Section } from "../Base";
import { useImmer } from "use-immer";

export default function AddressForm() {
  const address = useImmer({
    name: "Quinn Hipp",
    organization: "Pet Cemetery",
    email: "qhipp@noemail.com",
    phone_number: "4195777420",
    fax_number: "",
    website: "qhipp.dev",
    notes: "The coolest guy",
    address: "123 Sesame St",
  });

  return (
    <>
      <InputGrid>
        {basicInput({ id: "name", label: "Contact Name" }, address)}
        {basicInput({ id: "organization", label: "Organization" }, address)}
      </InputGrid>
      <InputGrid>
        {basicInput({ id: "email", label: "Email" }, address)}
        {basicInput({ id: "phone_number", label: "Phone Number" }, address)}
      </InputGrid>
      <InputGrid>
        {basicInput({ id: "fax_number", label: "Fax Number" }, address)}
        {basicInput({ id: "website", label: "Website" }, address)}
      </InputGrid>
      {basicInput({ id: "address", label: "Address" }, address)}
      {basicTextArea({ id: "notes", label: "Notes" }, address)}
    </>
  );
}
