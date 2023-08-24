import Base, { Section } from "../Base";
import { OrderItemCard, SpecificationCards } from "./Items";
import { MapType } from "@/utilities/api";
import { flattenArray } from "@/utilities/api";
import { ButtonTypes, StandardButton } from "@/components/Inputs";
import { StandardSelect } from "@/components/Inputs";
import { useEffect, useState } from "react";
import { Option, SelectValue } from "react-tailwindcss-select/dist/components/type";
import Collapse from "@/components/Collapse";
import classNames from "classnames";
import StretchButton from "@/components/StretchButton";
import { Edit, EditButton, Trash, TrashButton, UserButton } from "@/components/Icons";
import { CatalogedTask, TaskComment, UserTask } from "@/data/models/tasks";
import { Data } from "@/data/schema";
import { useImmer } from "use-immer";
import UserSelect from "@/components/UserSelect";
import { OrderItem } from "@/data/models/orders";

const tasks = [{ id: 1, label: "Task 1", description: "This is a description", isDeleted: false },
{ id: 2, label: "Task 2", description: "Words are really cool!", isDeleted: false },
{ id: 3, label: "Task 3", description: "I hate words :(", isDeleted: false }];

const users = [
    {
        id: 1,
        name: "Austin"
    },
    {
        id: 2,
        name: "Boston"
    },
];

const basicCatalogedItem = {
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
    tasks: tasks,
    isDeleted: false,
}


const items: Array<Data<typeof OrderItem>> = [
    {
        id: 1,
        catalogedItem: basicCatalogedItem,
        specifications: { 1: [2, 3], 2: [10] },
        dimensions: {
            length: 4.5,
            width: 8.4,
            height: 9.3
        },
        userTasks: [
            {
                id: 1,
                taskId: 1,
                assignedUser: {
                    id: 1,
                    name: "Hello!"
                },
                startedOn: new Date(2023, 5),
                finishedOn: new Date(),
                comments: [
                    {
                        id: 1,
                        user: { id: 5, name: "USERNAME" },
                        postedOn: new Date(2020, 5),
                        content: "This is a comment that is nice and fancy!!"
                    },
                    {
                        id: 2,
                        user: { id: 5, name: "USERNAME" },
                        postedOn: new Date(2020, 5),
                        content: "This is a comment that is nice and fancy!!"
                    },
                    {
                        id: 3,
                        user: { id: 5, name: "USERNAME" },
                        postedOn: new Date(2020, 5),
                        content: "This is a comment that is nice and fancy!!"
                    }
                ]
            },
            {
                id: 2,
                taskId: 2,
                assignedUser: {
                    id: 1,
                    name: "Hello!"
                },
                startedOn: new Date(2023, 5),
                finishedOn: null,
                comments: []
            },
            {
                id: 3,
                taskId: 3,
                assignedUser: {
                    id: 1,
                    name: "Hello!"
                },
                startedOn: new Date(2023, 5),
                finishedOn: new Date(2023, 5),
                comments: []
            },
        ],
        price: "4.50",
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
        userTasks: [
            {
                id: 5,
                taskId: 3,
                assignedUser: {
                    id: 1,
                    name: "Hello!"
                },
                startedOn: null,
                finishedOn: null,
                comments: []
            },
        ],
        price: "4.50",
        notes: "These are some notes to describe the item!!",
        taxExempt: false,
    }
]

items.push(...items);

export enum TaskStatus {
    NOT_STARTED = "color-not-started",
    IN_PROGRESS = "color-progress",
    FINISHED = "color-completed",
}

export function getTaskStatus(task: Data<typeof UserTask>): TaskStatus {
    if (task.finishedOn !== null) {
        return TaskStatus.FINISHED;
    }
    if (task.startedOn !== null) {
        return TaskStatus.IN_PROGRESS;
    }

    return TaskStatus.NOT_STARTED
}

export function Comment({ comment }: { comment: Data<typeof TaskComment> }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 mb-3 last:mb-0">
            <div className="flex">
                <UserButton href="#" />
                <div className="text-m">{comment.user.name} <small className="text-gray-400 text-xs">{comment.postedOn.toLocaleDateString()} {comment.postedOn.toLocaleTimeString()}</small></div>
                <EditButton addClass="ml-auto" title="Edit Comment" />
                {/* ADD BEHAVIOR */}
                <TrashButton title="Delete Comment" />
            </div>
            <p className="ml-4">{comment.content}</p>
        </div>
    );
}


export function Task({ task, catalogedTasks }: { task: Data<typeof UserTask>, catalogedTasks: MapType<number, Data<typeof CatalogedTask>> }) {
    const catalogedTask = catalogedTasks[task.taskId];
    // TODO on change for select 
    // TODO users
    // TODO API LOL
    const userValues = users.map(x => { return { label: x.name, value: x.id.toString() } }) as Option[];
    const userHook = useImmer({
        assignedUser: task.assignedUser?.id
    });

    const [showComments, setShowComments] = useState(false);
    return (<>
        <div className="bg-white rounded-xl p-3 my-3 shadow-lg drop-shadow-lg">
            <div className="grid grid-cols-2">
                <div>
                    <div className={`text-lg w-fit badge ${getTaskStatus(task)}`}>{catalogedTask.label}</div>
                    <p className="text-gray-400">{catalogedTask.description}</p>
                </div>
                {/* TODO maybe fix menu? */}
                <UserSelect classNames={{
                    menu: "relative z-50 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 overflow-visible"
                }} hook={userHook} prop="assignedUser" />
            </div>
            <div className="grid grid-cols-3">
                <div>
                    {
                        task.startedOn === null ?
                            <span className="hover:underline text-blue-400 hover:cursor-pointer">Force Start</span> :
                            <span className="color-secondary badge">{task.startedOn.toLocaleDateString() + " " + task.startedOn.toLocaleTimeString()}</span>
                    }
                </div>
                <div>
                    {
                        task.finishedOn === null ?
                            task.startedOn === null ?
                                <span className="text-gray-600 italic">Not Finished</span> :
                                <span className="hover:underline text-blue-400 hover:cursor-pointer">Mark as Complete</span>
                            :
                            <span className="color-completed badge">{task.finishedOn.toLocaleDateString() + " " + task.finishedOn.toLocaleTimeString()}</span>
                    }
                </div>
                <div>
                    <button className="bg-sky-100 hover:bg-sky-200 hover:scale-105 rounded-xl px-2 text-sky-600" onClick={() => setShowComments(!showComments)}>Comments ({task.comments.length})</button>
                </div>
            </div>
            <Collapse className="bg-gray-200 rounded-xl p-3 mt-3" visible={showComments}>
                {task.comments.map(x => <Comment comment={x} key={x.id} />)}
            </Collapse>
        </div>
    </>
    );
}

export function getItemStatus(item: Data<typeof OrderItem>): TaskStatus {
    let isFinished = true;
    for (let task of item.userTasks) {
        if (getTaskStatus(task) === TaskStatus.IN_PROGRESS) {
            return TaskStatus.IN_PROGRESS;
        }
        if (getTaskStatus(task) === TaskStatus.NOT_STARTED) {
            isFinished = false;
        }
    }
    if (isFinished) {
        return TaskStatus.FINISHED
    }
    return TaskStatus.NOT_STARTED;
}

export function TasksCard(item: Data<typeof OrderItem>) {
    const catalogedTasks = flattenArray(item.catalogedItem.tasks);
    const [showTasks, setShowTasks] = useState(true);
    return (
        <div className="mt-5 w-full flex justify-center relative" key={item.id}>
            <Section className="transition">
                <div className="px-10 py-5">
                    <div className="flex justify-between">
                        <h3 className="text-lg align-text-top">{item.catalogedItem.type} <span className="text-sm text-gray-500 align-text-bottom">{item.catalogedItem.subType}</span></h3>
                        <div className="flex">
                            <div className="badge color-secondary mr-2">{item.dimensions?.length as number} x {item.dimensions?.width as number} x {item.dimensions?.height as number}</div>
                        </div>
                    </div>
                    <p>{item.notes}</p>
                    <SpecificationCards orderItem={item} catalogedItem={item.catalogedItem} showOptions={true} />
                    <StretchButton initialState={true} containerClass="mt-3" buttonClass={"rounded-full px-4 " + getItemStatus(item)} onClick={() => { setShowTasks(!showTasks) }}>Tasks</StretchButton>
                    <Collapse visible={showTasks}>
                        <div className="">
                            {item.userTasks.map(x => <Task task={x} catalogedTasks={catalogedTasks} key={x.id} />)}
                        </div>
                    </Collapse>
                </div>
            </Section>
        </div>
    )
}

export default function Tasks() {
    return (
        <Base sectionHeader="Tasks" subheader="View Tasks">
            {items.filter(x => x.userTasks.length > 0).map(x => TasksCard(x))}
        </Base>
    );
}