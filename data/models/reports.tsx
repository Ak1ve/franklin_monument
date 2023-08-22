import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

export const Report = cs(
  // TODO actual validation LMAO
  z.object({
    id: Snowflake,
    name: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  }),
  {}
);
