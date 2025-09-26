import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./GuestBooking.css";

const GuestBooking = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [guest, setGuest] = useState({ name: "", contact: "" });
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_URL}/parking`);
      const available = res.data.filter((slot) => slot.status === "Available");
      setSlots(available);
    } catch (err) {
      alert("Error fetching slots: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return alert("Please select a slot!");
    if (!guest.name || !guest.contact) return alert("Enter your name and contact!");

    try {
      const bookingData = {
        slotId: selectedSlot,
        guestName: guest.name,
        guestContact: guest.contact,
      };

      const res = await axios.post(`${API_URL}/bookings/guest`, bookingData);

      setBookingSuccess(res.data);
      setGuest({ name: "", contact: "" });
      setSelectedSlot("");
      fetchSlots();
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="guest-booking-container">
      <h2>Guest Booking</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={guest.name}
        onChange={(e) => setGuest({ ...guest, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Contact"
        value={guest.contact}
        onChange={(e) => setGuest({ ...guest, contact: e.target.value })}
      />
      <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
        <option value="">Select Slot</option>
        {slots.map((slot) => (
          <option key={slot._id} value={slot.slotNumber}>
            {slot.slotNumber} ({slot.status})
          </option>
        ))}
      </select>
      <button onClick={handleBooking}>Book Slot</button>

      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Confirmed!</h3>
          <p>Slot: {bookingSuccess.booking.slot}</p>
          <p>Guest: {bookingSuccess.booking.guestName}</p>
          {/* Use only booking ID for QR code to avoid "Data too long" */}
          <QRCodeCanvas value={`booking:${bookingSuccess.booking._id}`} />
        </div>
      )}
    </div>
  );
};

export default GuestBooking;
