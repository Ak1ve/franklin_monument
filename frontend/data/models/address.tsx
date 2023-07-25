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
    standardRoute()
)