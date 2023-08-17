import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Message, { StandardConfirm, StandardError, StandardMessage } from "@/components/message";
import { Address } from "@/data/models/address";
import { getter, standardGet } from "@/data/route";
import cs, { Data, getRouteParams, standardRoute } from "@/data/schema";
import { addresses } from "@/dummydata";
import Base, { Section } from "@/forms/Base";
import ListView, { ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { EndpointError } from "@/utilities/endpoint";
import { listCard } from "@/utilities/listcard";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

export function AddressCard({
  address,
  onClick,
}: {
  address: Data<typeof Address>;
  onClick: any;
}) {
  const header = (
    <div className="flex">
      <div className="text-lg font-medium">{address.organization}</div>
      <EditButton addClass="ml-auto" title="Edit Address" onClick={onClick} />
      <TrashButton title="Delete Address" />
    </div>
  );
  const leftSide = [
    <>Contact Name: {address.name}</>,
    <>Phone: {address.phoneNumber}</>,
    <>
      Email:
      <a className="underline ml-1" href="#">
        {address.email}
      </a>
    </>,
    <>
      Fax:
      <a className="underline ml-1" href="#">
        {address.faxNumber}
      </a>
    </>,
  ];
  const rightSide = [
    <>
      Cemetery Address:
      <a className="underline ml-1" href="#">
        {address.address}
      </a>
    </>,
    <>
      Website:
      <a className="underline ml-1" href={address.website!}>
        {address.website}
      </a>
    </>,
  ];

  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      footer=""
      header={header}
    ></ListCard>
  );
}


const AddressBookModel = cs(z.array(Address.schema), standardRoute());

export default listCard(AddressBookModel, ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const onCancel = () => setShowModal(false);
  const onSubmit = () => false;

  const addressElements = data.map((x) => (
    <AddressCard key={x.name as any} address={x} onClick={setShowModal} />
  ));

  return (
    <div>
      <Navbar active="Address Book" />
      <StandardModal
        showModal={showModal}
        title=""
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <AddressForm path="/addressbook/1" />
      </StandardModal>
      <ListView searchPlaceholder="Search orders..." filter="Hello">
        {addressElements}
      </ListView>
    </div>
  );

});

/*
export default function AddressBook() {
  const [showModal, setShowModal] = useState(false);
  const {status, data} = useSession({required: true});

  const onSubmit = () => { };

  const onCancel = () => {
    setShowModal(false);
  };

  const [addressList, setAddressList] = useState(null as Data<typeof Address>[] | null);
  const router = useRouter();
  useEffect(() => {
    AddressBookModel.route.get!(getRouteParams({
      router,
      schema: AddressBookModel,
      onSuccess(success) {
        setAddressList(success.data || null);
      },
      onError(err) {
        if (err.error.type === "Network") {
          err.error.error.info.then((x: EndpointError) => {
            if (x.type === "Permission") {
              
            }
          });
        }
      }
      
    }))
  }, []);
  
  if (status === "loading") {
    return "Loading...";
  }
  if (addressList === null) {
    return <Navbar active="Address Book" />
  }

  const addressElements = addressList.map((x) => (
    <AddressCard key={x.name as any} address={x} onClick={setShowModal} />
  ));
  //  TODO make AddressForm Dynamic!
  return (
    <div>
      <Navbar active="Address Book" />
      <StandardModal
        showModal={showModal}
        title=""
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <AddressForm path="/addressbook/1" />
      </StandardModal>
      <ListView searchPlaceholder="Search orders..." filter="Hello">
        {addressElements}
      </ListView>
    </div>
  );
}
*/