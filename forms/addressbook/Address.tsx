import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import { BasicInput, BasicSelect, BasicTextArea } from "@/utilities/form";
import { Section } from "../Base";
import { useImmer } from "use-immer";
import { formComponent } from "@/data/form";
import { Address } from "@/data/models/address";
import { Data } from "@/data/schema";
import { useState } from "react";


export default formComponent<Data<typeof Address>, {
  onPostSuccess: () => any
}>(Address, ({ register, form, isLoading, formProps }) => {
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  if (isLoading) {
    return <>Loading...</>;
  }
  const onClick = () => {
    form.post((success => {
      formProps.onPostSuccess();
      setErrorMessage(null);
    }), err => {
      setErrorMessage(JSON.stringify(err as any));
    })
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
    {errorMessage !== null && <div className="text-red-400">An error has occured: {errorMessage}</div>}
    <StandardButton type={ButtonTypes.ACTIVE} onClick={onClick} className="ml-auto">Submit</StandardButton>
  </>
  )
});