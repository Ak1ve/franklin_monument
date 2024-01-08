// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { CatalogedItem } from '@/data/models/items';
import { Data } from '@/data/schema'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';
import { catalogedItemSelector } from '@/utilities/selectors';

const prisma = new PrismaClient();


export default endpoint({
    getParams: userParams<Data<typeof CatalogedItem>[]>(true),
    get: reqPerm("canViewCatalogedItems", async ({res}) => {
        const catalogedItems = await prisma.catalogedItem.findMany({
            select: catalogedItemSelector,
            where: {
                deleted: null
            }
        })
        res.status(200).json(catalogedItems);
    })
})
