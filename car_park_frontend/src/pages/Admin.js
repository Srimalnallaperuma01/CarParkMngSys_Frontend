import AddSlot from "../components/Slots/AddSlot";
import SlotList from "../components/Slots/SlotList";

export default function Admin() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <AddSlot />
      <SlotList />
    </div>
  );
}
