import { PrismaClient, User } from '@prisma/client'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';


const prisma = new PrismaClient();



export default endpoint({
    getParams: userParams<any>(true),
    get: reqPerm("canViewReports", async ({req, res}) => {
        const {startDate, endDate} = req.body;
        /*
        req.body = {
            startDate: string,
            endDate: string
        }
        */
        // make the appropriate database calls

        res.status(200).json({
            monthlySummary: [
                ["", ""],
                ["Jan 2012", 1920]
            ]
        });
    })
})
