import { z } from "zod";

export const Snowflake = z.coerce.number().nonnegative();
