import { ButtonTypes, InputGrid, StandardButton } from "@/components/Inputs";
import Base, { Section } from "../Base";
import { useImmer } from "use-immer";
import { BasicCheckbox, BasicInput, BasicTextArea } from "@/utilities/form";
import { OptionCard } from "../orders/Items";
import { CatalogedItem, ItemOption } from "@/models/CatalogedItem";
import { ItemCard } from "@/pages/items";
import { Edit, EditButton, TrashButton } from "@/components/Icons";
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

function OptionValueCard({ label, sublabel }: { label: string, sublabel: string }) {
    return (
        <div className="w-80 rounded-xl border shadow-2xl p-4 flex">
            <div className="text-lg">{label}</div>
            <div className="text-sm text-gray-400 ml-1 self-end">{sublabel}</div>
            <EditButton addClass="ml-auto self-center"/>
            <TrashButton addClass="self-center" />
        </div>
    );
}

function OptionValueForm() {
    // TODO FINISH THIS?? HELLO?
    const form = useImmer({} as unknown);
    
    return (
        <>
            <h2 className="section-header">Values</h2>
            <hr className="mb-5" />
            <div className="grid grid-cols-12">
                <div className="col-span-10">
                    <InputGrid>
                        <BasicInput hook={form} label="Label" placeholder="Enter text..." prop="optionValueLabel" />
                        <BasicInput hook={form} label="Additional Info" placeholder="Enter text..." prop="optionValueSublabel" />
                    </InputGrid>
                </div>
                <div className="col-span-2 self-end mb-8">
                    <StandardButton type={ButtonTypes.ACTIVE} className="self-end">Add Value</StandardButton>
                </div>
            </div>
            <div className="flex flex-wrap p-2 gap-8">
                <OptionValueCard label="Hello!" sublabel="Gray and Yellow"/>
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
        <StandardModal title="Options" showModal={hook[0]} onCancel={onCancel}>
            <BasicInput prop= "optionName" label= "Option Name" placeholder="Enter text..." hook={form} />
            <InputGrid maxColumns={3}>
                <BasicCheckbox prop="allowMulti" label="Allow multi-selection" hook={form} />
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
                        <BasicInput prop="type" label="Item Type" placeholder="Enter text..." hook={form} />
                        <BasicInput prop= "subtype" label= "Item Subtype" placeholder= "Enter text..." hook={form} />
                    </InputGrid>
                    <InputGrid>
                        <BasicCheckbox prop= "commissionable" label= "Commissionable" hook={form} />
                        <BasicCheckbox prop= "sizeable" label= "Has Dimensions" hook={form} />
                    </InputGrid>
                    <BasicTextArea prop= "description" label= "Description" hook={form} />
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