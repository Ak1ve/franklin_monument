import { formComponent } from "@/data/form";
import Base, { Section } from "../Base";
import { UserPermissions } from "@/data/models/user";
import { BasicCheckbox, HookProps } from "@/utilities/form";
import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import { InfoButton, InfoIcon } from "@/components/Icons";
import { useEffect, useState } from "react";
import { AdditionalInfo, StandardImportantConfirm, StandardInfo } from "@/components/message";
import Modal from "@/components/Modal";
import { Data } from "@/data/schema";
import { ImmerHook } from "use-immer";
import { HeaderBadge } from "../ListView";

import Notification from "@/components/notification";
import { EndpointError } from "@/utilities/endpoint";


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


type PermissionEffects = "no-risk" | "low-risk" | "medium-risk" | "financial" | "high-risk";

function permissionEffect<S extends keyof Data<typeof UserPermissions>>(permission: S): PermissionEffects {
  switch (permission) {
    case "canViewAddresses":
    case "canViewOrders":
    case "canViewCatalogedItems":
    case "canViewCatalogedTasks":
    case "canMakeTaskComments":
      return "no-risk";
    case "canEditAddresses":
    case "canEditCatalogedItems":
    case "canEditOrderItems":
    case "canEditOrders":
    case "canEditCatalogedTasks":
    case "canCreateAddresses":
    case "canCreateCatalogedItems":
    case "canCreateCatalogedTasks":
    case "canCreateOrderItems":
    case "canUploadDocuments":
    case "canCreateOrders":
      return "low-risk";
    case "canForceStartTasks":
    case "canMarkForeignTasksComplete":
    case "canDeleteAddresses":
    case "canDeleteCatalogedItems":
    case "canDeleteCatalogedTasks":
      return "medium-risk";
    case "canViewOrderFinancials":
    case "canViewReports":
      return "financial";
    case "canCreateUsers":
    case "canDeleteUsers":
    case "canEditUsers":
      return "high-risk";
    default:
      throw "UNDETECTED PERMISSION"
  }
}

function PermissionBadge<S extends keyof Data<typeof UserPermissions>>({ permission }: { permission: S }) {
  let effect = permissionEffect(permission);
  let color = {
    "no-risk": "bg-green-200",
    "low-risk": "bg-gray-200",
    "medium-risk": "bg-yellow-200",
    "financial": "bg-red-200",
    "high-risk": "bg-red-400"
  }[effect];

  let title = "This permission " + (effect === "financial" ?
    "allows for viewing of financial information." : `allows for ${effect} changes.`);
  let addClass = effect === "financial" ? "italic" : (effect === "high-risk" ? "font-extrabold" : "");
  let prefix = effect === "financial" ? "*" : (effect === "high-risk" ? "**" : "");

  return (
    <HeaderBadge className={color + " " + addClass} title={title}>{prefix}{addSpace(permission)}</HeaderBadge>
  );
}

function isEffect(stateHook: ImmerHook<null | Data<typeof UserPermissions>>, permision: PermissionEffects): boolean {
  for (const perm of Object.keys(stateHook[0]!)) {
    if (permissionEffect(perm as any) === permision && (stateHook[0] as any)[perm as any] === true) {
      return true;
    }
  }
  return false;
}

function PermissionBody({ stateHook }: { stateHook: ImmerHook<null | Data<typeof UserPermissions>> }) {
  return (<>
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {Object.keys(stateHook[0]!).filter(x => (stateHook[0] as any)[x as any]).map(x => (
        <PermissionBadge permission={x as any} key={x} />
      ))}
    </div>
    {isEffect(stateHook, "financial") && <div className="italic text-xs">*These permissions allow for viewing of financial information.</div>}
    {isEffect(stateHook, "high-risk") && <div className="font-extrabold text-xs">**These permissions give the user access to the entire system.</div>}
    <br />
    Changing permissions will take up to 5-10 minutes to take effect.  Are you sure you want to change these permissions?
  </>)
}

export default formComponent(UserPermissions, ({ register, errors, form, stateHook, isLoading }) => {
  const confirmHook = useState(false);
  const successHook = useState(false);
  const errorHook = useState(!!errors);


  if (isLoading) {
    return <>Loading...</>;
  }

  const onConfirm = () => {
    form.post(success => {
      confirmHook[1](false);
      successHook[1](true);
    }, err => {
      confirmHook[1](false);
      errorHook[1](true);
    });
  };


  return (
    <Base sectionHeader="Permissions" className="mb-20" subheader={
      <StandardButton type={ButtonTypes.ACTIVE} className="mx-auto" onClick={() => confirmHook[1](true)}>Save</StandardButton>
    }>
        <StandardImportantConfirm title="Are you sure want to grant the following permissions to this user?" onConfirm={onConfirm} width="md:w-6/12" hook={confirmHook}>
          <PermissionBody stateHook={stateHook} />
        </StandardImportantConfirm>
      <Notification hook={successHook} type="success">
        Permissions updated.  Please wait 5-10 minutes for changes to be in effect.
      </Notification>
      <Notification hook={errorHook} type="danger" dismissAfter="never">
        Cannot Update Permissions: {(errors as EndpointError)?.error}
      </Notification>

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
        ["canDeleteCatalogedTasks", "canViewCatalogedTasks"]
      ]} register={register}>
        These are in reference to the <Href>/tasks/</Href> page.  These permissions are in reference
        to changing how tasks are setup/displayed.<br />
        Create/Edit: Should only be given to trusted individuals.<br />
        Delete: Very sensitive permission.  Give sparingly.<br />
        View: Should probably be given to everyone.
      </PermissionSection>
      <PermissionSection section="User Tasks" fields={[
        ["canMarkForeignTasksComplete", "canMakeTaskComments"],
        ["canForceStartTasks"]
      ]} register={register}>
        TODO
      </PermissionSection>
      <PermissionSection section="Orders" fields={[
        ["canCreateOrders", "canEditOrders"],
        ["canUploadDocuments", "canCreateOrderItems"],
        ["canEditOrderItems", "canViewOrders"]
      ]} register={register}>
        TODO
      </PermissionSection>
      <PermissionSection section="Users" fields={[
        ["canCreateUsers", "canEditUsers"],
        ["canDeleteUsers"]
      ]} register={register}>
        These are in reference to the <Href>/users/</Href> page.  <b>These permissions are very
          sensitive and should be given sparingly</b><br />
        Create Users: Create a link that allows another user to be added to the organization.<br />
        Edit Users: Allows to edit permissions, tasks, information of users.  <b>If this permission is
          granted, the user will have full access to this website as they can edit their own permissions.</b><br />
        Delete Users: Should only be given to those who can edit users.
      </PermissionSection>
      <PermissionSection section="Reports" fields={[
        ["canViewOrderFinancials", "canViewReports"]
      ]} register={register}>
        These are in reference to the <Href>/orders/</Href> and <Href>/reports/</Href> pages. <b>These permisions
          allow for viewing of financial information and should be given sparingly.</b><br />
        View Order Financials: Can see the money & payment amounts for an order.<br />
        View Reports: Allows to see the reports that track trends.
      </PermissionSection>
    </Base>
  )
})