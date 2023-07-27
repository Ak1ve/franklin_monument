import {z} from "zod";
import {standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

export const Address = cs(
    // TODO actual validation LMAO
    z.object({
        id: Snowflake,
        name: z.string(),
        organization: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
        faxNumber: z.string(),
        website: z.string(),
        notes: z.string(),
        address: z.string()
    }),
    {
        get: (params) => (new Promise(resolve => resolve({success: true, data:{
            id: 5,
            name: params.path,
            organization: params.path,
            email: params.path,
            phoneNumber: params.path,
            faxNumber: params.path,
            website: params.path,
            notes: params.path,
            address: params.path,
    }})))
    }
    // standardRoute()
)