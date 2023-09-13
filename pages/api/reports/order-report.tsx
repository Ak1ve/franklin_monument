import { PrismaClient, User } from "@prisma/client";
import { endpoint, reqPerm, userParams } from "@/utilities/endpoint";
import { OrderReport } from "@/data/models/reports";
import { Data } from "@/data/schema";
import { start } from "repl";

const prisma = new PrismaClient();

export default endpoint({
  getParams: userParams<Data<typeof OrderReport>>(true),
  get: reqPerm("canViewReports", async ({ req, res }) => {
    const { startDate, endDate } = req.query;
    /*
        req.body = {
            startDate: string,
            endDate: string
        }
        */
    // make the appropriate database callss

    res.status(200).json({
      totalOrders: 29,
      ordersByStatus: [
        ["", ""],
        ["Not Started", 36],
        ["In Progress", 15],
        ["Completed", 43],
      ],
      ordersByType: [
        ["", ""],
        ["Service", 13],
        ["Memorial", 5],
        ["Invoice", 21],
      ],
      ordersByCemetary: [
        ["", ""],
        ["Pet Cemetary", 7],
        ["Fisher Titus", 11],
        ["Loserville", 4],
      ],
      ordersByDeliveryMethod: [
        ["", ""],
        ["FedEx", 13],
        ["UPS", 9],
        ["USPS", 3],
        ["Pigeon", 10],
      ],
    });
  }),
});
