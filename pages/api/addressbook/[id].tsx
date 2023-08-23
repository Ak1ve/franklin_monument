// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import { divyQueryId, endpoint, permOrError, reqPerm, userParams } from '@/utilities/endpoint';

const prisma = new PrismaClient();

/*
async ({ req, res, user }) => {
    const contactId = req.query.id as string;
    const  {id, ...body}: Data<typeof Address> = req.body;
    // new
    if (contactId === "new") {
      const canCreate = await permOrError("canCreateAddresses", user, res);
      if (!canCreate) return;
      await prisma.contact.create({
        data: {
          ...body
        }
      })
      res.status(200).json({success: true});
      return;
    }
    const canEdit = permOrError("canEditAddresses", user, res);
    if (!canEdit) return;
    await prisma.contact.update({
      where: {
        id: parseInt(contactId)
      },
      data: {
        ...body
      }
    })
    res.status(200).json({success: true});
  }
  */

export default endpoint({
  getParams: userParams<Data<typeof Address>>(true),
  get: reqPerm("canViewAddresses", async ({ req, res }) => {
    if (req.query.id === "new") {
      res.status(200).json(Address.createNew!);
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
  }),
  post: divyQueryId(
    reqPerm("canCreateAddresses", async ({req, res}) => {
      await prisma.contact.create({
        data: {
          ...req.body
        }
      })
      res.status(200).json({success: true});
    }),
    reqPerm("canEditAddresses", async ({req, res}) => {
      await prisma.contact.update({
        where: {
          id: parseInt(req.query.id as string)
        },
        data: {
          ...req.body
        }
      });
      res.status(200).json({success: true});
    })
  ),
  delete: reqPerm("canDeleteAddresses", async ({req, res}) => {
    const id = parseInt(req.query.id as string);
    await prisma.contact.delete({
      where: {
        id: id
      }
    });
    res.status(200).json({success: true});
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
