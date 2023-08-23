import { EditButton, TrashButton } from "@/components/Icons";
import Modal, { StandardModal } from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Message, { StandardConfirm, StandardDelete, StandardError, StandardMessage } from "@/components/message";
import { Address } from "@/data/models/address";
import { getter, standardGet } from "@/data/route";
import cs, { Data, getRouteParams, standardRoute } from "@/data/schema";
import { addresses } from "@/dummydata";
import Base, { Section } from "@/forms/Base";
import ListView, { ListCard } from "@/forms/ListView";
import AddressForm from "@/forms/addressbook/Address";
import { UseStateHook } from "@/utilities/api";
import { EndpointError } from "@/utilities/endpoint";
import { listCard } from "@/utilities/listcard";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

export interface AddressCardProp {
  address: Data<typeof Address>
  onDelete?: () => any
  onEdit?: () => any
}

export function AddressCard({address, onDelete, onEdit}: AddressCardProp) {
  const header = (
    <div className="flex">
      <div className="text-lg font-medium">{address.organization}</div>
      {onEdit && <EditButton addClass="ml-auto" title="Edit Address" onClick={onEdit} />}
      {onDelete && <TrashButton title="Delete Address" onClick={onDelete}/>}
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
    <>
    Fax:
    <a className="underline ml-1" href="#">
      {address.faxNumber}
    </a>
  </>,
  ];

  return (
    <ListCard
      leftFields={leftSide}
      rightFields={rightSide}
      footer={<div className="text-gray-400">{address.notes}</div>}
      header={header}
      className={onDelete === undefined ? "!w-full" : "" }
    ></ListCard>
  );
}


const AddressBookModel = cs(z.array(Address.schema), standardRoute(), []);

export default listCard(AddressBookModel, ({ data, isLoading, loadingMessage, isError, errorMessage, refresh, deleteId }) => {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState("1" as number | string);
  const [confirmIndex, setConfirmIndex] = useState(null as null | number)
  const confirmHook = [confirmIndex !== null, (x: boolean) => setConfirmIndex(null)] as UseStateHook<boolean>; // hack lol

  const onCancel = () => setShowModal(false);
  if (isError) {
    return errorMessage;
  }

  if (isLoading) {
    return loadingMessage;
  }

  const addressElements = data.map((x, index) => (
    <AddressCard key={x.name as any} address={x} onEdit={() => {
      setShowModal(true);
      setPage(x.id);
    }} onDelete={() => {
      setConfirmIndex(index);
    }} />
  ));

  const onNew = () => {
    setShowModal(true);
    setPage("new");
  };

  return (
    <div>
      <Navbar active="Address Book" />
      <StandardDelete hook={confirmHook} onDelete={() => {deleteId(data[confirmIndex!].id);setConfirmIndex(null);}}>
        {confirmIndex !== null && <AddressCard address={data[confirmIndex]} />}
      </StandardDelete>
      <Modal showModal={showModal}
        title={page === "new" ? "Create Address" : "Edit Address"}
        onExit={onCancel}
        footer={null}
      >
        <AddressForm path={`/addressbook/${page}`} onPostSuccess={() => {
          setShowModal(false);
          refresh();
        }}/>
      </Modal>
      <ListView searchPlaceholder="Search contacts..." filter="Hello" title="Address Book" onNew={onNew}>
        {addressElements}
      </ListView>
    </div>
  );
});