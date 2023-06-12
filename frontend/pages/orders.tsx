import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import OrderList from '@/components/OrderList'

const inter = Inter({ subsets: ['latin'] })

export default function Orders() {
  return (<>
      <Navbar active="Orders"/>
      <OrderList />
      </>
  )
}
