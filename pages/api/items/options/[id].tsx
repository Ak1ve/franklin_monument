// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { Data } from '@/data/schema'
import { divyQueryNew, endpoint, permOrError, reqPerm, userParams } from '@/utilities/endpoint';
import { CatalogedItemOption } from '@/data/models/items';

const prisma = new PrismaClient();

export default endpoint({
  getParams: userParams<Data<typeof CatalogedItemOption>>(true),
  get: reqPerm("canViewAddresses", async ({ req, res }) => {
    if (req.query.id === "new") {
      res.status(200).json(CatalogedItemOption.createNew!);
      return;
    }
    const optionId = parseInt(req.query.id as string);
    const option = await prisma.catalogedItemOption.findUnique({
      where: {
        id: optionId
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
      const {id, ...body} = req.body;
      await prisma.contact.create({
        data: {
          ...body
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