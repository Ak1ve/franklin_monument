import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";
import { CatalogedItem, ItemOptionValue } from "./items";
import { Address } from "./address";
import { User } from "./user";
import { UserTask } from "./tasks";
import { Contact } from "./contacts";

export enum OrderStatus {
  CANCELLED = "Cancelled",
  ACTIVE = "Active",
  PRODUCTION_HOLD = "Production Hold",
  READY_TO_INVOICE = "Ready To Invoice",
  INVOICED = "Invoiced",
  PAID = "Paid",
}

export const Dimensions = cs(
  z.object({
    length: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number(),
  }),
  {}, null
);

// map of ItemOption: item option values
export const Specifications = cs(
  z.map(Snowflake, z.array(ItemOptionValue.schema)),
  {}, null
);

export const OrderItem = cs(
  z.object({
    id: Snowflake,
    catalogedItem: CatalogedItem.schema,
    specifications: z.array(Specifications.schema),
    dimensions: Dimensions.schema.nullable(),
    userTasks: z.array(UserTask.schema),
    price: z.string(),
    notes: z.string(),
    taxExempt: z.boolean(),
  }),
  standardRoute(),
  null
);

export const OrderOverview = cs(
  z.object({
    deceasedName: z.string().nullable(),
    orderType: z.string().nullable(),
    promiseDate: z.date().nullable(),
    customerContact: Contact.schema.nullable(),
    taxExempt: z.boolean(),
    deliveryMethod: z.string().nullable(),
    cemetery: Address.schema,
    description: z.string(),
  }),
  standardRoute(),
  null
);

export const Payment = cs(
  z.object({
    id: Snowflake,
    amount: z.number().nonnegative(),
    paymentDate: z.date(),
    paymentType: z.string(),
    notes: z.string(),
  }),
  {},
  null
);

export const Order = cs(
  z.object({
    id: Snowflake,
    items: z.array(OrderItem.schema),
    proofs: z.null(), // TODO
    placement: z.null(), // TODO
    orderCreated: z.date(),
    documents: z.null(), // TODO
    overview: OrderOverview.schema, // TODO
    createdBy: User.schema,
    payments: z.array(Payment.schema),
    status: z.string(),
    isDeleted: z.boolean(),
  }),
  {},
  null
);

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
