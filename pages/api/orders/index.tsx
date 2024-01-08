import { Order } from "@/data/models/orders";
import { Data } from "@/data/schema";
import { endpoint, userParams, reqPerm, divyQueryId, cacheFor } from "@/utilities/endpoint";
import { orderSelector } from "@/utilities/selectors";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default endpoint({
    getParams: userParams<Data<typeof Order>[]>(true),
    get: reqPerm("canViewOrders", async ({req, res}) => {
        const orders = await prisma.order.findMany({
            select: orderSelector,
            where: {
                deleted: null
            }
        });
        res.status(200).json(orders);
    })
})