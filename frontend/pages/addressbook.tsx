import Address from "@/components/Address";
import Navbar from "@/components/Navbar";

export default function AddressBook() {
  return (
    <div>
      <Navbar active="Tasks" />
      <div>Address Book</div>
      <Address />
    </div>
  );
}
