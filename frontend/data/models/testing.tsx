import {z} from "zod";
import {standardRoute } from "../schema";
import createSchema  from "../schema";
import { Snowflake } from "./base";
const cs = createSchema;

export const HelloType = cs(
    z.object({
       name: z.string().endsWith("bruh"),
       goose: z.coerce.number().gt(1)
    }),
    standardRoute()
);