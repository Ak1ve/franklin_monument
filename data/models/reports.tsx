import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

// export const Report = cs(
//   // TODO actual validation LMAO
//   z.object({
//     id: Snowflake,
//     name: z.string(),
//     startDate: z.date(),
//     endDate: z.date(),
//   }),
//   {}
// );

export const FinancialReport = cs(
  z.object({
    monthlySummary: z.array(z.array(z.string().or(z.number()))),
    totalPayments: z.object({ quantity: z.number(), amount: z.number() }),
    numberOfOrders: z.array(z.array(z.string().or(z.number()))),
  }),
  standardRoute(["get"], undefined, "/financial-summary"),
  null
);
