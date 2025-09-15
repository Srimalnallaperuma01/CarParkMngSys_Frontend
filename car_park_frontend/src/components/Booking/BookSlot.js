import { useState } from "react";
import axios from "axios";

export default function BookSlot() {
  const [slotId, setSlotId] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, 
        { slotId, bookingDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successful");
    } catch (err) {
      console.error(err);
      alert("Error booking slot");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Slot ID" value={slotId} onChange={e => setSlotId(e.target.value)} />
      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
      <button type="submit">Book Slot</button>
    </form>
  );
}
