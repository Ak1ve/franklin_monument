// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Data<typeof Address>>
) {
  if (req.method === "GET") {
    const { id } = req.query!;
    if (typeof id === "string") {
      const contact = await prisma.contact.findUnique({
        where: {
          id: parseInt(id)
        },
      });
      if (contact === null) {
        return;
      }
      res.status(200).json(contact);
    }
  }
}
