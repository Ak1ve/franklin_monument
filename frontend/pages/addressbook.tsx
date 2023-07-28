import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { Address } from "@/data/models/address";
import { Data } from "@/data/schema";
import { addresses } from "@/dummydata";
import Base, { Section } from "@/forms/Base";
import ListView, { ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { useState } from "react";

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
      <a className="underline ml-1" href={address.website}>
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

export default function AddressBook() {
  const [showModal, setShowModal] = useState(false);

  const onSubmit = () => {};

  const onCancel = () => {
    setShowModal(false);
  };

  const addressList = addresses;

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
      {/* <Base sectionHeader="Address Book" className="mt-10">
        <AddressCard address={addresses[0]} onClick={setShowModal} />
      </Base> */}
    </div>
  );
}
