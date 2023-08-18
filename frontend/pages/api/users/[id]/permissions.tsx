import { UserPermissions } from "@/data/models/user";
import { Data } from "@/data/schema";
import { endpoint, userParams, reqPerm } from "@/utilities/endpoint";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export default endpoint({
    getParams: userParams<Data<typeof UserPermissions>>(true),
    get: reqPerm("canViewCatalogedItems", async ({req, res}) => {
        const userId = parseInt(req.query.id as string);
        const perms = await prisma.user.findUnique({
            select: {
                canCreateCatalogedItems: true,
                canEditCatalogedItems: true,
                canDeleteCatalogedItems: true,
                canViewCatalogedItems: true,
                canCreateCatalogedTasks: true,
                canEditCatalogedTasks: true,
                canDeleteCatalogedTasks: true,
                canViewCatalogedTasks: true,
                canCreateAddresses: true,
                canEditAddresses: true,
                canDeleteAddresses: true,
                canViewAddresses: true,
                canCreateOrders: true,
                canEditOrders: true,
                canViewOrders: true,
                canForceStartTasks: true,
                canUploadDocuments: true,
                canMakeTaskComments: true,
                canMarkForeignTasksComplete: true,
                canCreateOrderItems: true,
                canEditOrderItems: true,
                canViewOrderFinancials: true,
                canViewReports: true,
                canCreateUsers: true,
                canEditUsers: true,
                canDeleteUsers: true
            },
            where: {
                id: userId
            }
        });
        res.status(200).json(perms!);
    })
})