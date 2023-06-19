import { ItemOptionValueID, OrderItem, SpecificationValues } from "@/models/Orders";
import Base, { Section } from "../Base";
import Modal, { ModalSection, StandardModal } from "@/components/Modal";
import { ButtonTypes, InputGrid, StandardButton, StandardSelect } from "@/components/Inputs";
import { ImmerHook, useImmer } from "use-immer";
import { basicCheckbox, basicInput, basicSelect, basicTextArea } from "@/utilities/form";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { CatalogedItem, ItemOption, ItemOptionValue } from "@/models/CatalogedItem";
import { getSelectValue, normalizeSelectValue } from "@/utilities/select";
import { flattenArray, mapGetOr, unflattenIDMap, unflattenMap } from "@/utilities/api";
import { useState } from "react";
import classNames from "classnames";
import Collapse from "@/components/Collapse";

export interface ItemsProps {

}


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


const items: Array<OrderItem> = [
    {
        id: 1,
        catalogedItem: basicCatalogedItem,
        specifications: {1: [2, 3], 2: [10]},
        dimensions: {
            length: 4.5,
            width: 8.4,
            height: 9.3
        },
        price: "4.50",
        userTasks: [],
        notes: "These are some notes to describe the item!!",
        taxExempt: false,
    },
    {
        id: 2,
        catalogedItem: basicCatalogedItem,
        specifications: { 1: [1, 2, 3], 2: [10, 11, 12], 3: [100, 101, 102, 103], 7: [200, 201, 203] },
        dimensions: {
            length: 4.5,
            width: 8.4,
            height: 9.3
        },
        userTasks: [],
        price: "4.50",
        notes: "These are some notes to describe the item!!",
        taxExempt: false,
    }
]

items.push(...items);

function SpecficiationSelect({ option, stateHook, number }: { option: ItemOption, stateHook: ImmerHook<OrderItem>, number: number }) {
    const options = option.values.filter(x => !x.isDeleted).map(x => {
        const subLabel = x.subtext !== "" ? " - " + x.subtext : "";
        return {
            label: x.label + subLabel,
            value: x.id.toString()
        }
    });
    const onChange = (val: SelectValue) => {
        stateHook[1](draft => {
            draft.specifications[number] = normalizeSelectValue(val);
        });
    };
    const value = stateHook[0].specifications[number];
    return (
        <StandardSelect onChange={onChange} value={getSelectValue(options, value as unknown as string[], option.allowMulti)} options={options} id={"itemSpecification" + number.toString()}
            label={option.key} isMultiple={option.allowMulti} />
    );
}


function getFullSpecs(orderItem: OrderItem, catalogedItem: CatalogedItem): Array<{ option: ItemOption, values: ItemOptionValue[] }> {
    const options = flattenArray(catalogedItem.options);
    return unflattenIDMap(orderItem.specifications).map(x => {
        return {
            option: options[x.id],
            values: options[x.id].values.filter(value => x.value.includes(value.id as never))
        };
    });
}

export function SpecificationCards({ orderItem, catalogedItem, showOptions }: { orderItem: OrderItem, catalogedItem: CatalogedItem, showOptions: boolean }) {
    return (
            <Collapse visible={showOptions} className="flex flex-wrap w-100">
                {getFullSpecs(orderItem, catalogedItem).map(obj => (
                    <div key={obj.option.id} className="mt-2 shadow-lg drop-shadow p-1 rounded-lg bg-sky-100 mr-3">
                        <h3 className="underline text-black text-center text-m mb-1">{obj.option.key}</h3>
                        <div className="flex flex-wrap text-sm">
                            {obj.values.map(val => (
                                <div className="badge bg-white m-1">
                                    {val.label}{val.subtext === "" ? "" : ` - ${val.subtext}`}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Collapse>
    )
}


export function OrderItemCard(item: OrderItem) {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <li className="mt-5 w-full flex justify-center" key={item.id as string}>
            <Section className="transition" innerClassName="hover:scale-105 hover:cursor-pointer">
                <div className="px-10 py-5" onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
                    <div className="flex justify-between">
                        <h3 className="text-lg align-text-top">{item.catalogedItem.type} <span className="text-sm text-gray-500 align-text-bottom">{item.catalogedItem.subType}</span></h3>
                        <div className="flex">
                            <div className="badge color-secondary mr-2">{item.dimensions?.length as number}x{item.dimensions?.width as number}x{item.dimensions?.height as number}</div>
                            <div className="badge color-active">${item.price}</div>
                        </div>
                    </div>
                    <div className="p-3 divide-x-2 divide-purple-400 text-m text-gray-700">
                        <div></div>
                        {item.catalogedItem.description}
                    </div>
                    <p className="">
                        {item.notes}
                    </p>
                    <SpecificationCards orderItem={item} showOptions={showOptions} catalogedItem={item.catalogedItem} />
                </div>
            </Section>
        </li>
    );
}



export default function Items(props: ItemsProps) {
    /*
    {
        id: 2,
        catalogedItem: basicCatalogedItem,
        specifications: { 1: [1, 2, 3], 2: [10, 11, 12], 3: [100, 101, 102, 103], 7: [200, 201, 203] },
        dimensions: {
            length: 4.5,
            width: 8.4,
            height: 9.3
        },
        userTasks: [],
        price: "4.50",
        notes: "These are some notes to describe the item!!",
        taxExempt: false,
    }
    */
    const [show, setShow] = useState(true);
    const itemModalState = useImmer<OrderItem>(items[1]); // TODO generate!!
    console.log(items[1]);
    // TODO every cataloged item must be filtered for whether or not the cataloged item is deleted
    const selectHook = useImmer({ "catalogedItem": null });
    // TODO not "Submit Item" for title for standard modal 
    return (
        <>
            <StandardModal title="Submit Item" showModal={show} onCancel={() => setShow(false)}>
                <ModalSection header="Calaloged Item">
                    {/* TODO */}
                    {basicSelect({ id: "catalogedItem", label: "Item", options: [{ label: "Hooks", value: "1" }, { label: "Hooks", value: "2" }] }, selectHook)}
                </ModalSection>
                <ModalSection header="Specifications">
                    <InputGrid maxColumns={2}>
                        {itemModalState[0].catalogedItem.options.filter(x => !x.isDeleted).map((option, index) => <SpecficiationSelect option={option} stateHook={itemModalState} number={index} key={index} />)}
                    </InputGrid>
                </ModalSection>
                <ModalSection header="Item Details">
                    {itemModalState[0].catalogedItem.sizeable &&
                        <InputGrid>
                            {basicInput({ id: "orderItemLength", label: "Length", type: "number", step: "any" }, itemModalState, "dimensions.length")}
                            {basicInput({ id: "orderItemWidth", label: "Width", type: "number", step: "any" }, itemModalState, "dimensions.width")}
                            {basicInput({ id: "orderItemHeight", label: "Height", type: "number", step: "any" }, itemModalState, "dimensions.height")}
                        </InputGrid>
                    }
                    <InputGrid>
                        {basicInput({ id: "orderItemPrice", label: "Price", type: "number", step: ".01" }, itemModalState, "price")}
                        {basicCheckbox({ id: "orderItemTaxExempt", label: "Tax Exempt" }, itemModalState, "taxExempt")}
                    </InputGrid>
                    {basicTextArea({ id: "orderItemNotes", label: "Notes", rows: 5 }, itemModalState, "notes")}
                </ModalSection>
                {/* TODO remove if not editing tasks */}
                <ModalSection header={<div className="flex w-100 justify-between">
                    Tasks
                <StandardButton className="text-sm">Auto Assign Tasks</StandardButton>
                </div>}>
                    {itemModalState[0].catalogedItem.tasks.filter(task => !task.isDeleted).map(task => (
                        <div className="grid grid-cols-2 mb-3 hover:bg-green-50 outline outline-1 outline-gray-300 p-3 rounded-xl" key={task.id}>
                            <div>
                                <div className="badge color-active">{task.label}</div>
                                <p className="ml-4 text-gray-500">{task.description}</p>

                            </div>
                            {/* TODO for users */}
                            {basicSelect({ id: "orderItemTask" + task.id.toString(), label: "User", options: [{ label: "Dog", value: "1" }, { label: "Dog", value: "2" }, { label: "Dog", value: "3" }] }, selectHook, "tasks" + task.id.toString())}
                        </div>
                    ))}
                </ModalSection>
            </StandardModal>
            <Base sectionHeader="Order Items" subheader={
                <div className="flex justify-center">
                    <StandardButton type={ButtonTypes.ACTIVE} className="text-center">New Item</StandardButton>
                </div>
            } className="overflow-hidden mb-96">
                <ul className="h-100">
                    {items.map(x => OrderItemCard(x))}
                    <div>{"\u200B"}</div>
                </ul>
            </Base>
        </>
    );
}