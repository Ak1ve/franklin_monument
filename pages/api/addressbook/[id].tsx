// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import { divyQueryNew, endpoint, permOrError, reqPerm, userParams } from '@/utilities/endpoint';

const prisma = new PrismaClient();

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
  post: divyQueryNew(
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