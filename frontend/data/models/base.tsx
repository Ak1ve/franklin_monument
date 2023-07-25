import { z } from "zod";

export const Snowflake = z.coerce.number().nonnegative();



const a = z.object({a: z.number()}).safeParse({a: "123"});

if (!a.success) {
    a.error
}