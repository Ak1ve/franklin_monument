import { UserSelectOptions } from "@/data/models/user";
import { Data } from "@/data/schema";
import { endpoint, userParams, reqPerm, divyQueryId, cacheFor } from "@/utilities/endpoint";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export default endpoint({
    getParams: userParams<UserSelectOptions>(true),
    get: divyQueryId(
        ["select"],
        // select
        cacheFor(async () => {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true
                },
            });

            const a = users!.map(x => ({ label: x.name || "", value: x.id.toString() }));
            return a;
        }))
})