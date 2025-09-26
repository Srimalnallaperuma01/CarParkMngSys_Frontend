import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { UserContext } from "../context/UserContext";
import "./BookSlot.css";

const BookSlot = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      fetchSlots();
    }
  }, [currentUser, navigate]);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_URL}/parking`);
      setSlots(res.data);
    } catch (err) {
      alert("Error fetching slots: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBooking = async (slot) => {
    if (!slot) return alert("Please select a slot!");
    if (slot.status === "Booked") return alert("Slot already booked!");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      const bookingData = {
        slotId: slot.slotNumber,
      };

      const res = await axios.post(`${API_URL}/bookings`, bookingData, config);

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
          <div
            key={slot._id}
            className={`slot-card ${slot.status} ${selectedSlot === slot ? "selected" : ""}`}
            onClick={() => slot.status === "Available" && setSelectedSlot(slot)}
          >
            {slot.slotNumber} ({slot.status})
          </div>
        ))}
      </div>

      <button
        onClick={() => handleBooking(selectedSlot)}
        disabled={!selectedSlot}
        className="book-button"
      >
        Book Selected Slot
      </button>

      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Confirmed!</h3>
          <p>Slot: {bookingSuccess.booking.slot}</p>
          <p>User: {currentUser.username}</p>
          {/* Only pass booking ID to QR code to avoid "Data too long" */}
          <QRCodeCanvas value={`booking:${bookingSuccess.booking._id}`} />
        </div>
      )}
    </div>
  );
};

export default BookSlot;
