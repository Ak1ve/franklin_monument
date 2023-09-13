// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { CatalogedItem } from '@/data/models/items';
import { Data } from '@/data/schema'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';

const prisma = new PrismaClient();

export const catalogedItemSelector = {
    id: true,
    type: true,
    subtype: true,
    description: true,
    isCommissionable: true,
    isSizeable: true,
    options: {
        select: {
            id: true,
            key: true,
            allowNull: true,
            allowMulti: true,
            deleted: true,
            values: {
                select: {
                    id: true,
                    label: true,
                    subtext: true,
                    deleted: true
                }
            }
        }
    },
    catalogedTasks: {
        select: {
            id: true,
            label: true,
            description: true,
            collation: true,
            triggersAfter: true,
            triggersAtBeginning: true,
            triggersAfterAllTasks: true,
            deleted: true
        }
    },
    deleted: true,
};

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
