// src/components/BookSlot.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { QRCodeCanvas } from "qrcode.react";
import { UserContext } from "../context/UserContext";
import "./BookSlot.css";

const BookSlot = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (!currentUser) navigate("/login");
    fetchSlots();
    // eslint-disable-next-line
  }, [currentUser, navigate]);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      setSlots(res.data);
    } catch (err) {
      alert("Error fetching slots: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBooking = async (slot) => {
    if (!slot) return alert("Please select a slot!");
    if (slot.status === "Booked") return alert("Slot already booked!");

    try {
      const bookingData = { slotId: slot.slotNumber };
      const res = await axiosInstance.post("/bookings", bookingData);
      setBookingSuccess(res.data);
      fetchSlots();
      setSelectedSlot(null);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="book-slot-container">
      <h2>Book a Slot</h2>
      <div className="slots-grid">
        {slots.map((slot) => (
          <div key={slot._id}
               className={`slot-card ${slot.status.toLowerCase()} ${selectedSlot === slot ? "selected" : ""}`}
               onClick={() => slot.status === "Available" && setSelectedSlot(slot)}>
            {slot.slotNumber} ({slot.status})
          </div>
        ))}
      </div>

      <button onClick={() => handleBooking(selectedSlot)} disabled={!selectedSlot} className="book-button">
        Book Selected Slot
      </button>

      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Confirmed!</h3>
          <p>Slot: {bookingSuccess.booking?.slot?.slotNumber || bookingSuccess.booking?.slot}</p>
          <p>User: {currentUser?.name}</p>
          <QRCodeCanvas value={`booking:${bookingSuccess.booking?._id}`} />
        </div>
      )}
    </div>
  );
};

export default BookSlot;
