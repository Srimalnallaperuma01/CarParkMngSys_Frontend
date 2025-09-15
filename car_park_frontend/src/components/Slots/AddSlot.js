import { useState } from "react";
import axios from "axios";

export default function AddSlot() {
  const [location, setLocation] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/parkingslots`, 
        { location, slotNumber, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Slot added!");
    } catch (err) {
      console.error(err);
      alert("Error adding slot");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <input placeholder="Slot Number" value={slotNumber} onChange={e => setSlotNumber(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button type="submit">Add Slot</button>
    </form>
  );
}
