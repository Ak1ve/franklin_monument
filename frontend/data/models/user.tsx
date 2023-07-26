// export interface User {
//     id: string | number
//     userName: string
// }
import {z} from "zod";
import {standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";
// TODO MORE 

export const User = cs(z.object({
    id: Snowflake,
    userName: z.string()
}), standardRoute());