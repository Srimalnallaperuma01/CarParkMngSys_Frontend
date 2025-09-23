import { useState } from "react";
import axios from "axios";

export default function BookSlot({ slotId, slotNumber, onBooked }) {
  const [bookingDate, setBookingDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate) return alert("Please choose a date");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, { slotId, bookingDate, bookingTime: "09:00" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking successful");
      setBookingDate("");
      if (onBooked) onBooked(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop:8}}>
      <input type="date" value={bookingDate} onChange={e=>setBookingDate(e.target.value)} required />
      <button type="submit">Book {slotNumber}</button>
    </form>
  );
}
