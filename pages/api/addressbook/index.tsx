// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, User } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';
import { z } from 'zod';
import { addressContactSelector } from '@/utilities/selectors';

const prisma = new PrismaClient();



export default endpoint({
    getParams: userParams<Data<typeof Address>[]>(true),
    get: reqPerm("canViewAddresses", async ({res}) => {
        const contacts = await prisma.contact.findMany({
            select: addressContactSelector,
            where: {
                orderContact: null
            }
        });
        res.status(200).json(contacts);
    })
})