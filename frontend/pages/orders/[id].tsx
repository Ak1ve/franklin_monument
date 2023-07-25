import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  InputGrid,
  StandardCheckbox,
  StandardInput,
  StandardSelect,
} from "@/components/Inputs";
import { useState } from "react";
import Overview from "@/forms/orders/Overview";
import { OrderOverview } from "@/models/Orders";
import Items from "@/forms/orders/Items";
import Tasks from "@/forms/orders/Tasks";
import Placement from "@/forms/orders/Placement";
import Proofs from "@/forms/orders/Proofs";
import Documents from "@/forms/orders/Documents";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

function FormComponent() {
  const [select, setSelect] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const options = [
    { label: "hello", value: "dog" },
    { label: "there", value: "sag" },
  ];
  return <></>;
}

export default function Order() {
  // const router = useRouter();
  // console.log(router.asPath)
  const [body, setBody] = useState("Overview");
  const bodyNav = (name: string) => {
    return { name: name, onClick: () => setBody(name), active: body === name };
  };
  const navs = [
    bodyNav("Overview"),
    bodyNav("Items"),
    bodyNav("Proofs"),
    bodyNav("Memorial Placement"),
    bodyNav("Tasks"),
    bodyNav("Documents"),
    bodyNav("Financial Summary"),
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
    description: null,
  };

  let bodyContent;
  if (body === "Overview") {
    bodyContent = (
      <Overview
        initialState={emptyOrderOverview}
        onSave={(x: OrderOverview) => {}}
      />
    );
  } else if (body === "Items") {
    bodyContent = <Items />;
  } else if (body === "Proofs") {
    bodyContent = <Proofs />;
  } else if (body === "Documents") {
    bodyContent = <Documents />;
  } else if (body === "Tasks") {
    bodyContent = <Tasks />;
  } else if (body === "Memorial Placement") {
    bodyContent = <Placement />;
  } else {
    bodyContent = <></>;
  }
  // <Overview initialState={emptyOrderOverview} onSave={(x: OrderOverview) => {console.log(x)}}/>
  return (
    <div className="overflow-x-clip">
      <Navbar active="*****" />
      <Sidebar header="Order" href="/orders" navs={navs}>
        {bodyContent}
      </Sidebar>
    </div>
  );
}

