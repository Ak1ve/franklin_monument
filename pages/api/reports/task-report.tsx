import { PrismaClient, User } from "@prisma/client";
import { endpoint, reqPerm, userParams } from "@/utilities/endpoint";
import { TaskReport } from "@/data/models/reports";
import { Data } from "@/data/schema";
import { start } from "repl";

const prisma = new PrismaClient();

export default endpoint({
  getParams: userParams<Data<typeof TaskReport>>(true),
  get: reqPerm("canViewReports", async ({ req, res }) => {
    const { startDate, endDate } = req.query;
    /*
        req.body = {
            startDate: string,
            endDate: string
        }
        */
    // make the appropriate database calls

    res.status(200).json({
      currentTasks: [
        ["Tasks", "Tasks in Progress"],
        ["Purchase", 36],
        ["Cut", 15],
        ["Etch", 43],
        ["Delivery", 8],
      ],
      taskStats: [
        ["Tasks", "Shortest", "Average", "Longest"],
        ["Purchase", 1.2, 2.5, 3.4],
        ["Cut", 3, 4.7, 7],
        ["Etch", 0.5, 1.6, 2.2],
        ["Delivery", 0.25, 1.5, 3],
      ],
      itemStats: [
        ["Items", "Average", "Median"],
        ["Memorial", 7.2, 7],
        ["Base", 11.6, 12],
        ["Loserville", 4.3, 4],
      ],
    });
  }),
});
