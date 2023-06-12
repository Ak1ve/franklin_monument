import { Order, OrderItem } from "@/models/Orders";
import Base, { Section } from "../Base";
import { CatalogedItem } from "@/models/CatalogedItem";
import { OrderItemCard, SpecificationCards } from "./Items";
import { CatalogedTask, TaskComment, UserTask } from "@/models/Tasks";
import { MapType } from "@/utilities/api";
import { flattenArray } from "@/utilities/api";
import { ButtonTypes, StandardButton } from "@/components/Inputs";
import { StandardSelect } from "@/components/Inputs";
import { User } from "@/models/User";
import { useEffect, useState } from "react";
import { Option, SelectValue } from "react-tailwindcss-select/dist/components/type";
import { getSelectValue, normalizeSelectValue } from "@/utilities/select";
import Collapse from "@/components/Collapse";
import classNames from "classnames";
import StretchButton from "@/components/StretchButton";

const tasks = [{ id: 1, label: "Task 1", description: "This is a description", isDeleted: false },
{ id: 2, label: "Task 2", description: "Words are really cool!", isDeleted: false },
{ id: 3, label: "Task 3", description: "I hate words :(", isDeleted: false }];

const users: User[] = [
    {
        id: 1,
        userName: "Austin"
    },
    {
        id: 2,
        userName: "Boston"
    },
];

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
    tasks: tasks,
    isDeleted: false,
}


const items: Array<OrderItem> = [
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
                    userName: "Hello!"
                },
                startedOn: new Date(2023, 5),
                finishedOn: new Date(),
                comments: [
                    {
                        id: 1,
                        user: {id: 5, userName: "USERNAME"},
                        postedOn: new Date(2020, 5),
                        content: "This is a comment that is nice and fancy!!"
                    },
                    {
                        id: 2,
                        user: {id: 5, userName: "USERNAME"},
                        postedOn: new Date(2020, 5),
                        content: "This is a comment that is nice and fancy!!"
                    },
                    {
                        id: 3,
                        user: {id: 5, userName: "USERNAME"},
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
                    userName: "Hello!"
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
                    userName: "Hello!"
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
                    userName: "Hello!"
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

export function getTaskStatus(task: UserTask): TaskStatus {
    if (task.finishedOn !== null) {
        return TaskStatus.FINISHED;
    }
    if (task.startedOn !== null) {
        return TaskStatus.IN_PROGRESS;
    }

    return TaskStatus.NOT_STARTED
}

export function Comment({comment}: {comment: TaskComment}) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 mb-3 last:mb-0">
            <div className="flex justify-between">
                <div>{comment.user.userName}</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="text-center align-middle"  width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
            </div>
        </div>
    );   
}


export function Task({ task, catalogedTasks }: { task: UserTask, catalogedTasks: MapType<number, CatalogedTask> }) {
    const catalogedTask = catalogedTasks[task.taskId];
    // TODO on change for select 
    // TODO users
    // TODO API LOL
    const userValues = users.map(x => { return { label: x.userName, value: x.id.toString() } }) as Option[];
    const [user, setUser] = useState(task.assignedUser?.id);
    const onChange = (val: SelectValue) => {
        const value = normalizeSelectValue(val);
        setUser(value.length === 1 ? value[0] : undefined);
    }
    const [showComments, setShowComments] = useState(false);
    return (<>
        <div className="bg-white rounded-xl p-3 my-3 shadow-lg drop-shadow-lg">
            <div className="grid grid-cols-2">
                <div>
                    <div className={`text-lg w-fit badge ${getTaskStatus(task)}`}>{catalogedTask.label}</div>
                    <p className="text-gray-400">{catalogedTask.description}</p>
                </div>
                <StandardSelect classNames={{
                    menu: "relative z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 overflow-visible"
                }} onChange={onChange} label="User" id={`userTask${task.id}`} value={getSelectValue(userValues, user as any, false)} options={userValues} />
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
                {task.comments.map(x => <Comment comment={x} key={x.id}/>)}
            </Collapse>
        </div>
    </>
    );
}

export function getItemStatus(item: OrderItem): TaskStatus {
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

export function TasksCard(item: OrderItem) {
    const catalogedTasks = flattenArray(item.catalogedItem.tasks);
    const [showTasks, setShowTasks] = useState(true);
    return (
        <div className="mt-5 w-full flex justify-center relative z-1" key={item.id as string}>
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
                    <StretchButton initialState={true} containerClass="mt-3" buttonClass={"rounded-full px-4 " + getItemStatus(item)} onClick={() => {setShowTasks(!showTasks)}}>Tasks</StretchButton>
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