import { ItemOptionValue } from "./CatalogedItem"
import { CatalogedItem, ItemOption } from "./CatalogedItem"
import { Contact } from "./Contacts"
import { UserTask } from "./Tasks";

export enum OrderStatus {
    CANCELLED = "Cancelled",
    ACTIVE = "Active",
    PRODUCTION_HOLD = "Production Hold",
    READY_TO_INVOICE = "Ready To Invoice",
    INVOICED = "Invoiced",
    PAID = "Paid"
}

export interface Dimensions {
    length: Number,
    width: Number,
    height: Number
}

export type ItemOptionValueID =  string | number;
export type SpecificationValues = ItemOptionValue[] | number[] | string[]
export type Specifications = {
    [key: ItemOptionValueID]: SpecificationValues;
};

export interface OrderItem {
    id: number | string
    catalogedItem: CatalogedItem
    specifications: Specifications  // TODO  // TODO also need to change the model representation within the python models
    dimensions: Optional<Dimensions>
    userTasks: UserTask[]
    price: string  
    notes: string
    taxExempt: boolean
}

export interface OrderOverview {
    deceasedName: Optional<string>  // TODO
    orderType: Optional<any>  // TODO
    promiseDate: Optional<Date>  // TODO
    customerContact: Optional<Contact>  // TODO
    taxExempt: Optional<boolean>  // TODO
    deliveryMethod: Optional<any>  // TODO
    cemetery: Optional<any>  // TODO
    description: Optional<string>  // TODO
}  // TODO

export interface Order {
    id: number | string
    items: OrderItem[]  // TODo need to change the inner models of model rep.
    proofs: any, // TODO
    placement: any // TODO
    orderCreated: Date
    documents: any // TODO
    overview: OrderOverview
    createdBy: any // TODO
    isDeleted: boolean
}