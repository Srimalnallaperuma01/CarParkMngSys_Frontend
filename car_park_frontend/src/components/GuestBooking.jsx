import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuestBooking.css";

const GuestBooking = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch slots function
  const fetchSlots = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/parking`);
      const available = res.data.filter((slot) => slot.status.toLowerCase() === "available");
      setSlots(available);
    } catch (err) {
      alert("Error fetching slots: " + (err.response?.data?.message || err.message));
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]); // include fetchSlots to satisfy ESLint

  const handleBooking = () => {
    if (!selectedSlot) return alert("Please select a slot!");
    navigate("/register");
  };

  return (
    <div className="guest-booking-container">
      <h2>Guest Booking</h2>

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
                key={slot._id || slot.id}
                className={selectedSlot?.slotNumber === slot.slotNumber ? "selected-row" : ""}
              >
                <td>{slot.slotNumber || slot.id}</td>
                <td className={`status ${slot.status.toLowerCase()}`}>{slot.status}</td>
                <td>{slot.price ? `LKR ${slot.price}` : "-"}</td>
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
