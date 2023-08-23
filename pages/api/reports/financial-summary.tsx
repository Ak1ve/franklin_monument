import { PrismaClient, User } from "@prisma/client";
import { endpoint, reqPerm, userParams } from "@/utilities/endpoint";
import { FinancialReport } from "@/data/models/reports";
import { Data } from "@/data/schema";
import { start } from "repl";

const prisma = new PrismaClient();

export default endpoint({
  getParams: userParams<Data<typeof FinancialReport>>(true),
  get: reqPerm("canViewReports", async ({ req, res }) => {
    const { startDate, endDate } = req.query;
    /*
        req.body = {
            startDate: string,
            endDate: string
        }
        */
    // make the appropriate database calls
    console.log(startDate, endDate);

    res.status(200).json({
      monthlySummary: [
        ["", ""], // Keep blank
        ["Jan 2023", 7216],
        ["Feb 2023", 1294],
        ["Mar 2023", 8274],
        ["Apr 2023", 2849],
        ["May 2023", 2843],
        ["Jun 2023", 2094],
        ["Jul 2023", 4274],
        ["Aug 2023", 5424],
        ["Sep 2023", 3850],
        ["Oct 2023", 3235],
        ["Nov 2023", 2922],
        ["Dec 2023", 4575],
      ],
      totalPayments: { quantity: 29, amount: 51306 },
      numberOfOrders: [
        ["", ""], // Keep blank
        ["Paid", 36],
        ["Unpaid", 20],
      ],
    });
  }),
});
