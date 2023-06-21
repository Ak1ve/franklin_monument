import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Base, { Section } from "@/forms/Base";
import ListView, { ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { Address } from "@/models/Address";
import { useState } from "react";

export function AddressCard({
  address,
  onClick,
}: {
  address: Address;
  onClick: any;
}) {
  const header = (
    <div className="flex">
      <a
        className="hover:text-sky-300 underline text-lg font-medium"
        href={`${address.organization}`}
      >
        {address.organization}
      </a>
      <EditButton addClass="ml-auto" title="Edit Address" onClick={onClick} />
      <TrashButton title="Delete Address" />
    </div>
  );
  const leftSide = [
    <>Contact Name: {address.name}</>,
    <>Phone: {address.phone_number}</>,
    <>
      Email:
      <a className="underline ml-1" href="#">
        {address.email}
      </a>
    </>,
    <>
      Website:
      <a className="underline ml-1" href={address.website}>
        {address.website}
      </a>
    </>,
  ];
  const rightSide = [
    <>Cemetery: {address.organization}</>,
    <>
      Address:
      <a className="underline ml-1" href="#">
        {address.address}
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

  const addresses: Array<Address> = [
    {
      name: "Quinn Hipp",
      organization: "Pet Cemetery",
      email: "qhipp@noemail.com",
      phone_number: "4195777420",
      fax_number: "",
      website: "https://qhipp.dev",
      notes: "The coolest guy",
      address: "123 Sesame St",
    },
  ];
  const addressElements = addresses.map((x) => (
    <AddressCard key={x as any} address={x} onClick={setShowModal} />
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
        <AddressForm />
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
