import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import { BasicInput, BasicSelect, BasicTextArea } from "@/utilities/form";
import { Section } from "../Base";
import { useImmer } from "use-immer";
import { formComponent } from "@/data/form";
import { Address } from "@/data/models/address";
import { Data } from "@/data/schema";


export default formComponent(Address, ({ register, errors, form, isLoading, formProps }) => {
  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <>
    <InputGrid>
      <BasicInput label="Contact Name" {...register("name")}/>
      <BasicInput label="Organization" {...register("organization")}/>
    </InputGrid>
    <InputGrid>
      <BasicInput label="Email" {...register("email")}/>
      <BasicInput label="Phone Number" {...register("phoneNumber")}/>
    </InputGrid>
    <InputGrid>
      <BasicInput label="Fax Number" {...register("faxNumber")}/>
      <BasicInput label="Website" {...register("website")}/>
    </InputGrid>
    <BasicInput label="Address" {...register("address")}/>
    <BasicTextArea label="Notes" {...register("notes")}/>
    <StandardButton type={ButtonTypes.ACTIVE} onClick={() => form.post()}>Post</StandardButton>
  </>
  )
});