// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, User } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';
import { z } from 'zod';

const prisma = new PrismaClient();


export default endpoint({
    getParams: userParams<Data<typeof Address>[]>(true),
    get: reqPerm("canViewAddresses", async ({res}) => {
        const contacts = await prisma.contact.findMany({
            select: {
                id: true,
                name: true,
                organization: true,
                email: true,
                phoneNumber: true,
                faxNumber: true,
                website: true,
                notes: true,
                address: true,
            },
            where: {
                orderContact: null
            }
        });
        res.status(200).json(contacts);
    })
})
