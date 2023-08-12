// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<Data<typeof Address>[]>
) {
    // TODO cemetery is NOT null
    if (req.method === "GET") {
        const contacts = await prisma.contact.findMany({
            where: {
                orderContact: null,
                orderCemetery: null
            },
        });

        res.status(200).json(contacts);
    }
}