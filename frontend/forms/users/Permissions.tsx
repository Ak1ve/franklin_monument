import { formComponent } from "@/data/form";
import Base, { Section } from "../Base";
import { UserPermissions } from "@/data/models/user";
import { BasicCheckbox, HookProps } from "@/utilities/form";
import { InputGrid } from "@/components/Inputs";
import { InfoButton, InfoIcon } from "@/components/Icons";
import { useState } from "react";
import { AdditionalInfo, StandardInfo } from "@/components/message";
import Modal from "@/components/Modal";
import { Data } from "@/data/schema";

/*
canCreateCatalogedItems
canEditCatalogedItems
canDeleteCatalogedItems
canViewCatalogedItems

canCreateCatalogedTasks
canEditCatalogedTasks
canDeleteCatalogedTasks
canViewCatalogedTasks

canCreateAddresses
canEditAddresses
canDeleteAddresses
canViewAddresses

canCreateOrders
canEditOrders
canViewOrders
canForceStartTasks
canUploadDocuments
canMakeTaskComments
canMarkForeignTasksComplete
canCreateOrderItems
canEditOrderItems
canViewOrderFinancials

canViewReports

canCreateUsers
canEditUsers
canDeleteUsers
*/

function Href({ children }: { children: string }) {
  return <a className="hover:underline text-sky-400 hover:text-sky-600" target="_blank" href={children}>{children}</a>
}


interface PermissionSectionProps {
  register: (prop: string) => HookProps<Data<typeof UserPermissions> | null>
  section: string,
  children: any
  fields: Array<Array<keyof Data<typeof UserPermissions>>>
}

function addSpace(str: string) {
  return str.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ");
}

function PermissionSection({ register, section, children, fields }: PermissionSectionProps) {
  return (
    <Section className="mt-20 mb-5">
      <div className="section-header mb-5">
        <div className="mx-auto">{section}</div>
        <AdditionalInfo info={section}>
          {children}
        </AdditionalInfo>
      </div>
      {fields.map((val, i) => (
        <InputGrid key={i}>
          {val.map((perm, v) => (
            <BasicCheckbox key={v} label={addSpace(perm.substring(3,))!} {...register(perm)} />
          ))}
        </InputGrid>
      ))}
    </Section>
  )
}
export default formComponent(UserPermissions, ({ register, errors, form }) => {
  return (
    <Base sectionHeader="Permissions" className="mb-20">
      <PermissionSection section="Cataloged Items" fields={[
        ["canCreateCatalogedItems", "canEditCatalogedItems"],
        ["canDeleteCatalogedItems", "canViewCatalogedItems"],
      ]} register={register}>
        These are in reference to the <Href>/items/</Href> page.<br />
        Create/Edit/Delete: Should only be given to those who are trusted to maintain
        the system.<br />
        View: Should probably be given to everyone.
      </PermissionSection>
      <PermissionSection section="Address Book" fields={[
        ["canCreateAddresses", "canEditAddresses"],
        ["canDeleteAddresses", "canViewAddresses"]
      ]} register={register}>
        These are in reference to the <Href>/addressbook/</Href> page.  These permissions are in reference
        to managing/viewing cemetery information.<br />
        Create/Edit: Good to give to those in case contact information changes, etc.<br />
        Delete: Should only be given to trusted indivuals.<br />
        View: Should probably be given to everyone. 
      </PermissionSection>
      <PermissionSection section="Cataloged Tasks" fields={[
        ["canCreateCatalogedTasks", "canEditCatalogedTasks"],
        ["canDeleteCatalogedItems", "canViewCatalogedTasks"]
      ]} register={register}>
        These are in reference to the <Href>/tasks/</Href> page.  These permissions are in reference
        to changing how tasks are setup/displayed.<br />
        Create/Edit: Should only be given to trusted individuals.<br />
        Delete: Very sensitive permission.  Give sparingly.<br />
        View: Should probably be given to everyone. 
      </PermissionSection>
      <PermissionSection section="Users" fields={[
        ["canCreateUsers", "canEditUsers"],
        ["canDeleteUsers"]
      ]} register={register}>
        These are in reference to the <Href>/users/</Href> page.  <b>These permissions are very
        sensitive and should be given sparingly</b><br />

      </PermissionSection>
    </Base>
  )
})


// export default function Permissions() {
//   return (
//     <Base sectionHeader="Permissions">
//       <Section className="mt-10">
//         <h2 className="section-header mb-5">Big Headstone</h2>
//       </Section>
//     </Base>
//   );
// }
