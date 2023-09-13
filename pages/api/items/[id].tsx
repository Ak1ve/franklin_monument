// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { CatalogedItem } from '@/data/models/items';
import { Data } from '@/data/schema'
import { divyQueryNew, endpoint, permOrError, reqPerm, standardAPIGetNew, userParams } from '@/utilities/endpoint';
import { catalogedItemSelector } from '.';

const prisma = new PrismaClient();

/*
get: reqPerm("canViewCatalogedItems", async ({ req, res }) => {
        if (req.query.id === "new") {
            res.status(200).json(CatalogedItem.createNew!);
            return;
        }
        const itemId = parseInt(req.query.id as string);
        const item = await prisma.catalogedItem.findUnique({
            where: {
                id: itemId
            },
            select: catalogedItemSelector
        });
        res.status(200).json(item!);
    }),
*/
export default endpoint({
    getParams: userParams<Data<typeof CatalogedItem>>(true),
    get: standardAPIGetNew({
        perms: "canViewCatalogedItems",
        schema: CatalogedItem,
        prisma,
        modelName: "catalogedItem",
        selector: catalogedItemSelector
    }),
    post: divyQueryNew(
        reqPerm("canCreateCatalogedItems", async ({ req, res }) => {
            // TODO id's and such... this will be hard
            
        }),
        reqPerm("canEditCatalogedItems", async ({ req, res }) => {
            // TODO
        })
    ),
    delete: reqPerm("canDeleteCatalogedItems", async ({ req, res }) => {
        const id = parseInt(req.query.id as string);
        // TODO set deleted to NOW
        res.status(200).json({ success: true });
    })
});