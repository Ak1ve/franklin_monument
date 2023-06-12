import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import OrderSidebar from '@/components/OrderSidebar';
import { InputGrid, StandardCheckbox, StandardInput, StandardSelect } from '@/components/Inputs';
import { useState } from 'react';
import Overview from '@/forms/orders/Overview';
import { OrderOverview } from '@/models/Orders';
import Items from '@/forms/orders/Items';
import Tasks from '@/forms/orders/Tasks';
import Placement from '@/forms/orders/Placement';
const inter = Inter({ subsets: ['latin'] })


function FormComponent() {
  const [select, setSelect] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const options = [{ label: "hello", value: "dog" }, { label: "there", value: "sag" }];
  return (
    <>
    </>
  );
}

export default function Order() {
  const [body, setBody] = useState("Overview");
  const bodyNav = (name: string) => { return { name: name, onClick: () => setBody(name), active: body === name } };
  const navs = [
    bodyNav("Overview"),
    bodyNav("Items"),
    bodyNav("Proofs"),
    bodyNav("Memorial Placement"),
    bodyNav("Tasks"),
    bodyNav("Documents"),
    bodyNav("Financial Summary")
  ];
  const emptyOrderOverview: OrderOverview = {
    deceasedName: null,
    orderType: undefined,
    promiseDate: null,
    customerContact: {
      name: null,
      organization: null,
      email: null,
      phoneNumber: null,
      faxNumber: null,
      website: null,
      notes: null,
    },
    taxExempt: false,
    deliveryMethod: undefined,
    cemetery: undefined,
    description: null
  }

  let bodyContent;
  if (body === "Overview") {
    bodyContent = <Overview initialState={emptyOrderOverview} onSave={(x: OrderOverview) => { }} />;
  } else if (body === "Items") {
    bodyContent = <Items />;
  } else if (body === "Tasks") {
    bodyContent = <Tasks />;
  } else if (body === "Memorial Placement") {
    bodyContent = <Placement />
  } else {
    bodyContent = <></>;
  }
  // <Overview initialState={emptyOrderOverview} onSave={(x: OrderOverview) => {console.log(x)}}/>
  return (
    <>
      <Navbar active="*****" />
      <OrderSidebar header="Order" navs={navs}>
        {bodyContent}
      </OrderSidebar>
    </>
  )
}
