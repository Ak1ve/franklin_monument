import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";

const DimensionData = z.array(z.array(z.string().or(z.number())));

export const FinancialReport = cs(
  z.object({
    monthlySummary: DimensionData,
    totalPayments: z.object({
      quantity: z.number(),
      amount: z.number(),
    }),
    numberOfOrders: DimensionData,
  }),
  standardRoute(["get"], undefined, "/financial-summary"),
  null
);

export const OrderReport = cs(
  z.object({
    ordersByStatus: DimensionData,
    ordersByType: DimensionData,
    ordersByCemetary: DimensionData,
    ordersByDeliveryMethod: DimensionData,
    totalOrders: z.number(),
  }),
  standardRoute(["get"], undefined, "/order-report"),
  null
);

export const TaskReport = cs(
  z.object({
    currentTasks: DimensionData,
    taskStats: DimensionData,
    itemStats: DimensionData,
  }),
  standardRoute(["get"], undefined, "/task-report"),
  null
);

export const UserTasksReport = cs(
  z.object({
    totalTaskComments: z.number(),
    userTaskStats: DimensionData,
    totalCurrentTasks: z.number(),
  }),
  standardRoute(["get"], undefined, "/user-tasks-report"),
  null
);
