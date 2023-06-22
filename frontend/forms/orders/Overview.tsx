import React from "react";
import { useState } from "react";
import Base, { Section } from "../Base";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { InputGrid, StandardButton, StandardDatepicker, StandardInput, StandardSelect, StandardTextArea } from "@/components/Inputs";
import { Order, OrderOverview } from "@/models/Orders";
import { basicCheckbox, basicDatepicker, basicInput, basicSelect, basicTextArea } from "@/utilities/form";
import { ImmerHook, Updater, useImmer } from "use-immer";
import { FileIcon, ImageIcon, PDF, PlusButton } from "@/components/Icons";


const cemeteries = [
    { label: "Another Cemetery Name", value: "1" },
    { label: "ANOTHER Cemetery Name", value: "2" }
];

const orderTypes = [
    { label: "Service", value: "1" },
    { label: "Memorial", value: "2" },
    { label: "Invoice", value: "3" },
    { label: "Our Truck", value: "3" },
    { label: "Our Truck", value: "3" }
];

const deliveryMethods = [
    { label: "Pickup", value: "1" },
    { label: "None", value: "2" },
    { label: "Our Truck", value: "3" },
    { label: "Our Truck", value: "3" },
    { label: "Our Truck", value: "3" }
];

export interface OverviewProps {
    initialState: OrderOverview,
    onSave: (state: OrderOverview) => any;

}

export default function Overview(props: OverviewProps) {
    const overviewHook = useImmer<OrderOverview>(props.initialState);

    return (
        <Base sectionHeader="Overview" subheader="Created 12/23/2004">
            <div className="flex justify-center">
                <StandardButton className="text-center" onClick={props.onSave(overviewHook[0])}>
                    Save
                </StandardButton>
            </div>
            <PDF width="50" height="50"/>
            <FileIcon width="50" height="50"/>
            <ImageIcon width="50" height="50" />
            <PlusButton>Add</PlusButton>
            <Section className="mt-10">
                <h2 className="section-header">Order Information</h2>
                {basicInput({ id: "deceasedName", label: "Deceased Name", placeholder: "Insert Text" }, overviewHook)}
                {basicSelect({ id: "cemetery", options: cemeteries, label: "Cemetery", isSearchable: true }, overviewHook)}
                <InputGrid>
                    {basicSelect({ id: "orderType", options: orderTypes, label: "Order Type" }, overviewHook)}
                    {basicSelect({ id: "deliveryMethod", options: deliveryMethods, label: "Delivery Method" }, overviewHook)}
                </InputGrid>
                <InputGrid>
                    {basicDatepicker({ id: "promiseDate", label: "Promise Date" }, overviewHook)}
                    {basicCheckbox({ id: "taxExempt", label: "Tax Exempt" }, overviewHook)}
                </InputGrid>
                    {basicTextArea({id: "description", label: "Order Description",
                     rows: 5, placeholder: "Enter Description..."}, overviewHook)}
            </Section>
            <Section className="mt-10 mb-10">
                <h2 className="section-header">Customer Contact Information</h2>
                {basicInput({ id: "customerContactName", label: "Customer Name", placeholder: "Enter Text" }, overviewHook, "customerContact.name")}
                <InputGrid>
                    {basicInput({ id: "customerContactPhone", label: "Phone Number", placeholder: "Enter Text" }, overviewHook, "customerContact.phoneNumber")}
                    {basicInput({ id: "customerContactFax", label: "Fax Number", placeholder: "Enter Text" }, overviewHook, "customerContact.faxNumber")}
                </InputGrid>
                <InputGrid>
                    {basicInput({ id: "customerContactOrganization", label: "Organization", placeholder: "Enter Text" }, overviewHook, "customerContact.organization")}
                    {basicInput({ id: "customerContactWebsite", label: "website", placeholder: "Enter Text" }, overviewHook, "customerContact.website")}
                </InputGrid>
                {basicTextArea({ id: "customerContactNotes", label: "Customer Contact Notes", rows: 5 }, overviewHook, "customerContact.notes")}
            </Section>
        </Base>
    );
}
