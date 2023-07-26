import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";
import { CatalogedItem, ItemOptionValue } from "./items";
import { Address } from "./address";
import { User } from "./user";
import { UserTask } from "./tasks";
import { Contact } from "./Contacts";


export enum OrderStatus {
    CANCELLED = "Cancelled",
    ACTIVE = "Active",
    PRODUCTION_HOLD = "Production Hold",
    READY_TO_INVOICE = "Ready To Invoice",
    INVOICED = "Invoiced",
    PAID = "Paid"
}

export const Dimensions = cs(z.object({
    length: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number()
}), {});

// map of ItemOption: item option values
export const Specifications = cs(z.record(Snowflake, z.array(ItemOptionValue.schema)), {});

export const OrderItem = cs(z.object({
    id: Snowflake,
    catalogedItem: CatalogedItem.schema,
    specifications: z.array(Specifications.schema),
    dimensions: Dimensions.schema.nullable(),
    userTasks: z.array(UserTask.schema),
    price: z.string(),
    notes: z.string(),
    taxExempt: z.boolean()
}), standardRoute());

export const OrderOverview = cs(z.object({
    deceasedName: z.string().nullable(),
    orderType: z.string().nullable(),
    promiseDate: z.date().nullable(),
    customerContact: Contact.schema.nullable(),
    taxExempt: z.boolean(),
    deliveryMethod: z.string().nullable(),
    cemetery: Address.schema,
    description: z.string()
}), standardRoute());

export const Order = cs(z.object({
    id: Snowflake,
    items: z.array(OrderItem.schema),
    proofs: z.null(), // TODO
    placement: z.null(), // TODO
    orderCreated: z.date(),
    documents: z.null(),  // TODO
    overview: OrderOverview.schema,  // TODO
    createdBy: User.schema,
    isDeleted: z.boolean()
}), {});  // TODo

// export interface Order {
//     id: number | string
//     items: OrderItem[]  // TODo need to change the inner models of model rep.
//     proofs: any, // TODO
//     placement: any // TODO
//     orderCreated: Date
//     documents: any // TODO
//     overview: OrderOverview
//     createdBy: any // TODO
//     isDeleted: boolean
// }