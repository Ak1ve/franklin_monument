import {z} from "zod";
import ModelForm, { ModelSchema, standardRoute } from "../schema";
import createSchema  from "../schema";
import { Snowflake } from "./base";
const cs = createSchema;

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