import { PrismaClient, User } from "@prisma/client";
import { endpoint, reqPerm, userParams } from "@/utilities/endpoint";
import { UserTasksReport } from "@/data/models/reports";
import { Data } from "@/data/schema";
import { start } from "repl";

const prisma = new PrismaClient();

export default endpoint({
  getParams: userParams<Data<typeof UserTasksReport>>(true),
  get: reqPerm("canViewReports", async ({ req, res }) => {
    const { startDate, endDate, userId } = req.query;
    /*
        req.body = {
            startDate: string,
            endDate: string
        }
        */
    // make the appropriate database calls
    console.log(startDate, endDate);

    res.status(200).json({
      totalTaskComments: 27,
      userTaskStats: [
        ["Task", "Average", "Median"],
        ["Purchase", 7.2, 7],
        ["Cut", 11.6, 12],
        ["Etch", 4.3, 4],
        ["Delivery", 1.5, 2],
      ],
      totalCurrentTasks: 13,
    });
  }),
});
