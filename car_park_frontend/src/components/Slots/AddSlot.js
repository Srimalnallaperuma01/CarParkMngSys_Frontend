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
      await axios.post(`${process.env.REACT_APP_API_URL}/parkingslots`, { location, slotNumber, price }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Slot added!");
      setLocation(""); setSlotNumber(""); setPrice("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding slot");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Parking Slot</h2>
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
      <input placeholder="Slot Number" value={slotNumber} onChange={e => setSlotNumber(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
      <button type="submit">Add Slot</button>
    </form>
  );
}
