// src/components/GuestBooking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuestBooking.css";

const GuestBooking = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  // Redirect to register page instead of booking
  const handleBooking = () => {
    if (!selectedSlot) return alert("Please select a slot!");
    navigate("/register");
  };

  return (
    <div className="guest-booking-container">
      <h2>Guest Booking</h2>

      {/* Slot Availability Table */}
      <table className="slots-table">
        <thead>
          <tr>
            <th>Slot ID</th>
            <th>Status</th>
            <th>Price (LKR)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.length > 0 ? (
            slots.map((slot) => (
              <tr
                key={slot._id}
                className={selectedSlot?.slotNumber === slot.slotNumber ? "selected-row" : ""}
              >
                <td>{slot.slotNumber}</td>
                <td className="status available">{slot.status}</td>
                <td>{slot.price || "-"}</td>
                <td>
                  <button
                    className="select-btn"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {selectedSlot?.slotNumber === slot.slotNumber ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No available slots
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Redirect to Register */}
      {selectedSlot && (
        <div className="guest-form">
          <h3>Enter Details</h3>
          <p>To book this slot, please register or login first.</p>
          <button className="book-btn" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestBooking;
