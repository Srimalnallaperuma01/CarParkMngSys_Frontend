import { useState } from "react";
import axios from "axios";

export default function BookSlot({ slotId }) {
  const [bookingDate, setBookingDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings`,
        { slotId, bookingDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successful!");
      setBookingDate("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error booking slot");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-slot-form">
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        required
      />
      <button type="submit">Book</button>
    </form>
  );
}
