import {z} from "zod";
import {standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

export const Address = cs(
    // TODO actual validation LMAO
    z.object({
        id: Snowflake,
        name: z.string().nullable(),
        organization: z.string().nullable(),
        email: z.string().email().nullable(),
        phoneNumber: z.string().nullable(),
        faxNumber: z.string().nullable(),
        website: z.string().nullable(),
        notes: z.string().nullable(),
        address: z.string().nullable()
    }),
    standardRoute()
)

/*
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
*/