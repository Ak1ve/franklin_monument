// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Address } from '@/data/models/address'
import { Data } from '@/data/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

type AddressData = Data<typeof Address>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressData>
) {
  res.status(200).json({
      id: 0,
      name: 'asd',
      organization: 'fafa',
      email: 'aesaa@gmail.com',
      phoneNumber: 'haeha',
      faxNumber: 'age',
      website: 'agaeg',
      notes: 'geagae',
      address: 'gaega'
  })
}
