// export interface Contact {
//     name: Optional<string>,
//     organization: Optional<string>,
//     email: Optional<string>,
//     phoneNumber: Optional<string>,
//     faxNumber: Optional<string>,
//     website: Optional<string>,
//     notes: Optional<string>
// }

import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

export const Contact = cs(z.object({
    name: z.string().nullable(),
    organization: z.string().nullable(),
    email: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    faxNumber: z.string().nullable(),
    website: z.string().nullable(),
    notes: z.string().nullable()
}), {});