import React from "react";
import { useState } from "react";
import Base, { Section } from "../Base";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { InputGrid, StandardButton, StandardDatepicker, StandardInput, StandardSelect, StandardTextArea } from "@/components/Inputs";
import { Order, OrderOverview } from "@/models/Orders";
import { BasicCheckbox, BasicDatepicker, BasicInput, BasicSelect, BasicTextArea } from "@/utilities/form";
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
            <PDF width="50" height="50" />
            <FileIcon width="50" height="50" />
            <ImageIcon width="50" height="50" />
            <PlusButton>Add</PlusButton>
            <Section className="mt-10">
                <h2 className="section-header">Order Information</h2>
                <BasicInput prop="deceasedName" label="Deceased Name" placeholder="Insert Text" hook={overviewHook} />
                <BasicSelect prop="cemetery" options={cemeteries} label="Cemetery" isSearchable={true} hook={overviewHook} />
                <InputGrid>
                    <BasicSelect prop="orderType" options={orderTypes} label="Order Type" hook={overviewHook} />
                    <BasicSelect prop="deliveryMethod" options={deliveryMethods} label="Delivery Method" hook={overviewHook} />
                </InputGrid>
                <InputGrid>
                    <BasicDatepicker prop="promiseDate" label="Promise Date" hook={overviewHook} />
                    <BasicCheckbox prop="taxExempt" label="Tax Exempt" hook={overviewHook} />
                </InputGrid>
                <BasicTextArea prop="description" label="Order Description" rows={5} placeholder="Enter Description..." hook={overviewHook} />
            </Section>
            <Section className="mt-10 mb-10">
                <h2 className="section-header">Customer Contact Information</h2>
                <BasicInput label="Customer Name" placeholder="Enter Text" hook={overviewHook} prop="customerContact.name" />
                <InputGrid>
                    <BasicInput label="Phone Number" placeholder="Enter Text..." hook={overviewHook} prop="customerContact.phoneNumber" />
                    <BasicInput label="Fax Number" placeholder="Enter Text..." hook={overviewHook} prop="customerContact.faxNumber" />
                </InputGrid>
                <InputGrid>
                    <BasicInput label="Organization" placeholder= "Enter Text" hook={overviewHook} prop="customerContact.organization" />
                    <BasicInput label= "website" placeholder= "Enter Text" hook={overviewHook} prop="customerContact.website" />
                </InputGrid>
                <BasicTextArea label="Customer Contact Notes" rows={5} hook={overviewHook} prop="customerContact.notes" />
            </Section>
        </Base>
    );
}
