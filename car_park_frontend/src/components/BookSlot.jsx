// src/components/BookSlot.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";
import { SlotsContext } from "../context/SlotContext";
import "./BookSlot.css";

const normalizeStatus = (status) => {
  if (!status) return "unknown";
  const s = status.toLowerCase();
  if (s === "available") return "available";  // green
  if (s === "pending") return "pending";      // orange
  if (s === "approved" || s === "booked") return "booked"; // red
  return "unknown";
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "available": return "#28a745";
    case "pending": return "#FFC107";
    case "booked": return "#dc3545";
    default: return "#6c757d";
  }
};

const BookSlot = () => {
  const { currentUser } = useContext(UserContext);
  const { setSlotsData } = useContext(SlotsContext);
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);

  // Fetch slots from backend and normalize their status
  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      const normalizedSlots = res.data.map(s => ({
        ...s,
        status: normalizeStatus(s.status),
      }));
      setSlots(normalizedSlots);
      setSlotsData(normalizedSlots.map(s => ({
        id: s._id,
        slotNumber: s.slotNumber,
        status: s.status
      })));
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchSlots();
  }, [currentUser, navigate]);

  const handleBooking = async () => {
    if (!selectedSlotId) return alert("Please select a slot!");
    if (!paymentSlip) return alert("Please upload a payment slip!");

    try {
      const bookingRes = await axiosInstance.post("/bookings", {
        slotId: selectedSlotId,
      });
      const bookingId = bookingRes.data.booking._id;

      const formData = new FormData();
      formData.append("slip", paymentSlip);
      await axiosInstance.post(`/bookings/${bookingId}/upload-slip`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBookingSuccess(bookingRes.data);

      // Update slot locally as pending (until admin approves)
      setSlots(prev =>
        prev.map(s => s._id === selectedSlotId ? { ...s, status: "pending" } : s)
      );
      setSlotsData(prev =>
        prev.map(s => s.id === selectedSlotId ? { ...s, status: "pending" } : s)
      );

      setSelectedSlotId(null);
      setPaymentSlip(null);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="book-slot-container">
      <h2>Book a Parking Slot</h2>

      <div className="slots-grid">
        {slots.map(slot => (
          <div
            key={slot._id}
            className={`slot-card ${slot.status} ${selectedSlotId === slot._id ? "selected" : ""}`}
            style={{
              border: `2px solid ${selectedSlotId === slot._id ? "#000" : getStatusColor(slot.status)}`,
              cursor: slot.status === "available" ? "pointer" : "not-allowed",
            }}
            onClick={() => slot.status === "available" && setSelectedSlotId(slot._id)}
          >
            <div className="slot-number">{slot.slotNumber}</div>
            <div className="slot-status" style={{ color: getStatusColor(slot.status) }}>
              {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
            </div>
            <div className="slot-price">{slot.price ? `LKR ${slot.price}` : "LKR 0"}</div>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPaymentSlip(e.target.files[0])}
        style={{ marginTop: "15px" }}
      />

      <button
        onClick={handleBooking}
        disabled={!selectedSlotId || !paymentSlip}
        className="book-button"
      >
        Book Selected Slot
      </button>

      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Pending Approval</h3>
          <p>Slot: {bookingSuccess.booking?.slot?.slotNumber || bookingSuccess.booking?.slot}</p>
          <p>User: {currentUser?.name}</p>
          <p>Status: Pending Approval</p>
        </div>
      )}
    </div>
  );
};

export default BookSlot;
