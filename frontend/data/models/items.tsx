import {z} from "zod";
import ModelForm, { ModelSchema, standardRoute } from "../schema";
import createSchema  from "../schema";
import { Snowflake } from "./base";
const cs = createSchema;

/*
export interface ItemOption {
    id: string | number
    key: string
    allowNull: boolean
    allowMulti: boolean
    isDeleted: boolean
    values: ItemOptionValue[]
}

export interface CatalogedItem {
    id: number | string
    type: string
    subType: string
    description: string
    commissionable: boolean
    sizeable: boolean
    options: ItemOption[]
    tasks: CatalogedTask[]
    isDeleted: boolean
}
*/

export const ItemOption = cs(
    z.object({
        id: Snowflake,
        type: z.string(),
        subType: z.string(),
        description: z.string(),
        // TODO
    }),
    standardRoute()
)
