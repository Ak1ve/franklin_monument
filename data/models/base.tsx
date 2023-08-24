import { z } from "zod";

export const Snowflake = z.coerce.number().nonnegative();

export const deletedDate = z.date().nullable();