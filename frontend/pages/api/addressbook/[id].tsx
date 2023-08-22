// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { endpoint, reqPerm, userParams } from '@/utilities/endpoint';
import { Contact } from '@/data/models/contacts';

const prisma = new PrismaClient();


export default endpoint({
  getParams: userParams<Data<typeof Address>>(true),
  get: reqPerm("canViewAddresses", async ({req, res}) => {
    if (req.query.id === "new") {
      res.status(200).json(Address.createNew);
      return;
    }
    const contactId = parseInt(req.query.id as string);
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId
      },
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
      }
    });
    res.status(200).json(contact!);
  })
});

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse<Data<typeof Address>>
// ) {
//   if (req.method === "GET") {
//     const { id } = req.query!;
//     if (typeof id === "string") {
//       const contact = await prisma.contact.findUnique({
//         where: {
//           id: parseInt(id)
//         },
//       });
//       if (contact === null) {
//         return;
//       }
//       res.status(200).json(contact);
//     }
//   }
// }
