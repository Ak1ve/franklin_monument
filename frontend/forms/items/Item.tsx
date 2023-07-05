import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Base, { Section } from "../Base";
import { useImmer } from "use-immer";
import { basicCheckbox, basicInput, basicTextArea } from "@/utilities/form";
import { OptionCard } from "../orders/Items";
import { CatalogedItem, ItemOption } from "@/models/CatalogedItem";
import { ItemCard } from "@/pages/items";
import { EditButton, TrashButton } from "@/components/Icons";
import { StandardModal } from "@/components/Modal";
import { Dispatch, SetStateAction, useState } from "react";
import { UseStateHook } from "@/utilities/api";

const basicCatalogedItem: CatalogedItem = {
    id: 1,
    type: "Base",
    subType: "Memorial",
    description: "A short description of the cataloged item in question",
    commissionable: true,
    sizeable: true,
    options: [{
        id: 1,
        key: "Grain",
        allowNull: true,
        allowMulti: false,
        isDeleted: false,
        values: [
            {
                id: 1,
                label: "Corase",
                subtext: "",
                isDeleted: false,
            },
            {
                id: 2,
                label: "Smooth",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 3,
                label: "Sandblasted",
                subtext: "Dark",
                isDeleted: false,
            }
        ],
    },
    {
        id: 2,
        key: "Cool Color",
        allowNull: true,
        allowMulti: true,
        isDeleted: false,
        values: [
            {
                id: 10,
                label: "Blue",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 11,
                label: "Green",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 12,
                label: "Green",
                subtext: "Dark",
                isDeleted: false,
            }
        ],
    },
    {
        id: 3,
        key: "Egg Joe",
        allowNull: true,
        allowMulti: true,
        isDeleted: false,
        values: [
            {
                id: 100,
                label: "Blue",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 101,
                label: "Green",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 102,
                label: "Green",
                subtext: "Dark",
                isDeleted: false,
            }
        ],
    },
    {
        id: 7,
        key: "Fine Color",
        allowNull: true,
        allowMulti: true,
        isDeleted: false,
        values: [
            {
                id: 200,
                label: "Blue",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 201,
                label: "Green",
                subtext: "light",
                isDeleted: false,
            },
            {
                id: 203,
                label: "Green",
                subtext: "Dark",
                isDeleted: false,
            }
        ],
    }],
    tasks: [
        { id: 1, label: "Task 1", description: "This is a description", isDeleted: false },
        { id: 2, label: "Task 2", description: "Words are really cool!", isDeleted: false },
        { id: 3, label: "Task 3", description: "I hate words :(", isDeleted: false }
    ],
    isDeleted: false,
}

function ItemOptionCard({ option }: { option: ItemOption }) {
    const header = (
        <div className="text-black text-center text-m mb-1 flex">
            <div className="">{option.key}</div>
            <EditButton addClass="ml-auto" />
            <TrashButton />
        </div>
    );
    return (
        <OptionCard option={option} header={header} />
    )
}

// TODO if an ItemOption is removed from the CatalogedItem Reference, dont DELETE the item, just remove
// the reference.  HOWEVER if the the item option is not referenced at ALL, then delete it!

function OptionValueForm() {
    const form = useImmer({});
    return (
        <>
            <h2 className="section-header">Values</h2>
            <hr className="mb-5" />
            <div className="grid grid-cols-12">
                <div className="col-span-10">
                    <InputGrid>
                    {basicInput({ id: "optionValueLabel", label: "Label", placeholder: "Enter text..." }, form)}
                    {basicInput({ id: "optionValueSublabel", label: "Additional Info", placeholder: "Enter text..." }, form)}
                    </InputGrid>
                </div>
                <div className="col-span-2 self-end mb-8">
                    <StandardButton type={ButtonTypes.ACTIVE} className="self-end">Add Value</StandardButton>
                </div>
            </div>
        </>
    );
}

function OptionModal({ hook }: { hook: UseStateHook<boolean> }) {
    const onCancel = () => {
        hook[1](false);
    }
    const form = useImmer({});
    return (
        <StandardModal title="Enter Title" showModal={hook[0]} onCancel={onCancel}>
            {basicInput({ id: "optionName", label: "Option Name", placeholder: "Enter text..." }, form)}
            <InputGrid maxColumns={3}>
                {basicCheckbox({ id: "allowMulti", label: "Allow multi-selection" }, form)}
            </InputGrid>
            <OptionValueForm />
        </StandardModal>
    )
}

export default function ItemForm() {
    const form = useImmer({});
    const showOptionHook = useState(true);
    return (
        <>
            <OptionModal hook={showOptionHook} />
            <Base sectionHeader="Cataloged Item">
                <Section className="mt-10">
                    <h2 className="section-header mb-2">Item Information</h2>
                    <InputGrid>
                        {basicInput({ id: "type", label: "Item Type", placeholder: "Enter text..." }, form)}
                        {basicInput({ id: "subtype", label: "Item Subtype", placeholder: "Enter text..." }, form)}
                    </InputGrid>
                    <InputGrid>
                        {basicCheckbox({ id: "commissionable", label: "Commissionable" }, form)}
                        {basicCheckbox({ id: "sizeable", label: "Has Dimensions" }, form)}
                    </InputGrid>
                    {basicTextArea({ id: "description", label: "Description" }, form)}
                </Section>
                <Section className="mt-10 mb-10">
                    <h2 className="section-header">Options</h2>
                    <div className="flex justify-center w-100">
                        <StandardButton type={ButtonTypes.ACTIVE} className="mr-2">New</StandardButton>
                        <StandardButton type={ButtonTypes.STANDARD}>Reference</StandardButton>
                    </div>
                    <div className="flex flex-wrap justify-center w-100 gap-2 p-3">
                        {basicCatalogedItem.options.map(obj => <ItemOptionCard option={obj} key={obj.id} />)}
                    </div>
                </Section>
            </Base>
        </>
    )
}