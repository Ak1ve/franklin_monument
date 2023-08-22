import { Address } from "./data/models/address";
import {
  CatalogedItem,
  ItemOption,
  ItemOptionValue,
} from "./data/models/items";
import {
  Dimensions,
  Order,
  OrderItem,
  OrderOverview,
  Payment,
} from "./data/models/orders";
import { CatalogedTask, TaskComment, UserTask } from "./data/models/tasks";
import { User } from "./data/models/user";
import { Data } from "./data/schema";

export const dimensions: Array<Data<typeof Dimensions>> = [
  {
    length: 24,
    width: 6,
    height: 36,
  },
  {
    length: 16,
    width: 4,
    height: 30,
  },
];

export const catalogedTasks: Array<Data<typeof CatalogedTask>> = [
  {
    id: 1,
    label: "Purchase",
    description: "Purchase stone from mason on 42nd Street.",
    isDeleted: false,
  },
  {
    id: 2,
    label: "Cut",
    description: "Use the stonecutter to shape stone to meet specification.",
    isDeleted: false,
  },
  {
    id: 3,
    label: "Etch",
    description: "Ensure the requested text is correct and etch into stone",
    isDeleted: false,
  },
  {
    id: 4,
    label: "Finishing Touches",
    description: "Polish the stone and make any last finishing touches.",
    isDeleted: false,
  },
  {
    id: 5,
    label: "Delivery",
    description: "Transport the finished item to desired destination.",
    isDeleted: false,
  },
];

export const itemOptionValues: Array<Data<typeof ItemOptionValue>> = [
  {
    id: 1,
    label: "",
    subtext: "",
    isDeleted: false,
  },
];

export const itemOptions: Array<Data<typeof ItemOption>> = [
  {
    id: 1,
    key: "Color",
    values: itemOptionValues,
    isDeleted: false,
    allowMulti: true,
    allowNull: false,
  },
  {
    id: 3,
    key: "Color",
    values: itemOptionValues,
    isDeleted: false,
    allowMulti: true,
    allowNull: false,
  },
  {
    id: 4,
    key: "Color",
    values: itemOptionValues,
    isDeleted: false,
    allowMulti: true,
    allowNull: false,
  },
  {
    id: 5,
    key: "Color",
    values: itemOptionValues,
    isDeleted: false,
    allowMulti: true,
    allowNull: false,
  },
  {
    id: 6,
    key: "Color",
    values: itemOptionValues,
    isDeleted: false,
    allowMulti: true,
    allowNull: false,
  },
];

export const catalogedItems: Array<Data<typeof CatalogedItem>> = [
  {
    id: 5,
    type: "Memorial",
    subType: "Monument",
    description: "todo",
    commissionable: true,
    sizeable: true,
    options: itemOptions,
    tasks: catalogedTasks,
    isDeleted: false,
    price: "$4999.99",
  },
  {
    id: 2,
    type: "Base",
    subType: "Memorial",
    description: "todo",
    commissionable: true,
    sizeable: true,
    options: itemOptions,
    tasks: catalogedTasks,
    isDeleted: false,
    price: "$949.99",
  },
  {
    id: 3,
    type: "Lettering",
    subType: "Memorial",
    description: "todo",
    commissionable: true,
    sizeable: true,
    options: itemOptions,
    tasks: catalogedTasks,
    isDeleted: false,
    price: "$54.00",
  },
  {
    id: 4,
    type: "Lasering",
    subType: "Memorial",
    description: "todo",
    commissionable: true,
    sizeable: true,
    options: itemOptions,
    tasks: catalogedTasks,
    isDeleted: false,
    price: "$79.49",
  },
  {
    id: 5,
    type: "Lasik",
    subType: "Memorial",
    description: "todo",
    commissionable: true,
    sizeable: true,
    options: itemOptions,
    tasks: catalogedTasks,
    isDeleted: false,
    price: "$49.99",
  },
];

export const users: Array<Data<typeof User>> = [
  {
    id: 1,
    userName: "Billy Bob",
  },
  {
    id: 2,
    userName: "Austin",
  },
  {
    id: 3,
    userName: "Quinn",
  },
  {
    id: 47,
    userName: "Coach Kent Murphy",
  },
];

export const taskComments: Array<Data<typeof TaskComment>> = [
  {
    id: 1,
    user: users[1],
    postedOn: new Date("2023-04-18"),
    content: "",
  },
];

export const userTasks: Array<Data<typeof UserTask>> = [
  {
    id: 1,
    taskId: 1,
    assignedUser: users[3],
    startedOn: null,
    finishedOn: null,
    comments: taskComments,
  },
];

export const orderItems: Array<Data<typeof OrderItem>> = [
  {
    id: 1,
    catalogedItem: catalogedItems[1],
    specifications: new Map(Object.entries({ 1: itemOptionValues })) as any,
    dimensions: dimensions[0],
    userTasks: userTasks,
    price: "",
    notes: "",
    taxExempt: false,
  },
];

export const addresses: Array<Data<typeof Address>> = [
  {
    id: 1,
    name: "Stephen King",
    organization: "Pet Cemetery",
    email: "kingsteveo@noemail.com",
    phoneNumber: "4195777420",
    faxNumber: "",
    website: "https://stephenking.com",
    notes: "Scary place",
    address: "123 Sesame St",
  },
  {
    id: 2,
    name: "Mateo Kraus",
    organization: "Among Us Cemetery",
    email: "mlk@noemail.com",
    phoneNumber: "1234567890",
    faxNumber: "0987654321",
    website: "https://sourkrausballs.net",
    notes: "Very sus",
    address: "69 Mullberry St",
  },
];

export const orderOverview: Array<Data<typeof OrderOverview>> = [
  {
    deceasedName: "John Doe",
    orderType: null,
    promiseDate: new Date("2023-08-27"),
    customerContact: null,
    taxExempt: true,
    deliveryMethod: null,
    cemetery: addresses[0],
    description: "John Doe's Tombstone",
  },
  {
    deceasedName: "Jane Foster",
    orderType: null,
    promiseDate: new Date("2023-09-30"),
    customerContact: null,
    taxExempt: true,
    deliveryMethod: null,
    cemetery: addresses[0],
    description: "Jane Foster's Tombstone",
  },
];

export const payments: Array<Data<typeof Payment>> = [
  {
    id: 1,
    amount: 1000,
    paymentDate: new Date("2023-02-23"),
    paymentType: "cash",
    notes: "",
  },
];

export const orders: Array<Data<typeof Order>> = [
  {
    id: 1,
    items: orderItems,
    proofs: null,
    placement: null,
    orderCreated: new Date("2023-02-16"),
    documents: null,
    overview: orderOverview[0],
    createdBy: users[1],
    payments: payments,
    status: "In progress",
    isDeleted: false,
  },
];
