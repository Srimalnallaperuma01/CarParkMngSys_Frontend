import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } });
      setBookings(res.data);
    };
    fetchBookings();
  }, []);

  return (
    <ul>
      {bookings.map(b => (
        <li key={b._id}>
          {b.slot?.slotNumber || b.slot} - {new Date(b.bookingDate).toLocaleDateString()} - {b.paymentStatus}
        </li>
      ))}
    </ul>
  );
}
