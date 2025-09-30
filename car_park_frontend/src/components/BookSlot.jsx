import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";
import { SlotsContext } from "../context/SlotContext";
import "./BookSlot.css";

// Normalize status
const normalizeStatus = (status) => {
  if (!status) return "available";
  const s = status.toLowerCase();
  if (s === "available") return "available";
  if (s === "pending") return "pending";
  if (s === "approved" || s === "booked") return "booked";
  return "available";
};

// Map status to colors
const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "available": return "#28a745"; // green
    case "pending": return "#FFC107";   // orange
    case "booked": return "#dc3545";    // red
    default: return "#6c757d";          // grey
  }
};

const BookSlot = () => {
  const { currentUser } = useContext(UserContext);
  const { slotsData, fetchSlots } = useContext(SlotsContext);
  const navigate = useNavigate();

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchSlots();
  }, [currentUser, navigate, fetchSlots]);

  const handleBooking = async () => {
    if (!selectedSlotId) return alert("Please select a slot!");
    if (!paymentSlip) return alert("Please upload a payment slip!");

    try {
      const bookingRes = await axiosInstance.post("/bookings", { slotId: selectedSlotId });
      const bookingId = bookingRes.data.booking._id;

      const formData = new FormData();
      formData.append("slip", paymentSlip);
      await axiosInstance.post(`/bookings/${bookingId}/upload-slip`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBookingSuccess(bookingRes.data);
      fetchSlots();
      setSelectedSlotId(null);
      setPaymentSlip(null);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="book-slot-container">
      <h2>Book a Parking Slot</h2>

      {/* Slot cards */}
      <div className="slots-grid">
        {slotsData.map((slot) => {
          const status = normalizeStatus(slot.status);
          return (
            <div
              key={slot._id}
              className={`slot-card ${selectedSlotId === slot._id ? "selected" : ""}`}
              style={{
                backgroundColor: getStatusColor(status),
                cursor: status === "available" ? "pointer" : "not-allowed",
                transform: selectedSlotId === slot._id ? "scale(1.05)" : "scale(1)",
              }}
              onClick={() => status === "available" && setSelectedSlotId(slot._id)}
            >
              <div className="slot-number">{slot.slotNumber}</div>
              <div className="slot-status">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
              <div className="slot-price">{`LKR ${slot.price}`}</div>
            </div>
          );
        })}
      </div>

      {/* Payment Slip Upload Section */}
      <div className="payment-slip-section">
        <label htmlFor="payment-slip" className="payment-slip-label">
          Upload Payment Slip
        </label>
        <input
          type="file"
          id="payment-slip"
          accept="image/*"
          onChange={(e) => setPaymentSlip(e.target.files[0])}
          className="payment-slip-input"
        />
        {paymentSlip && <span className="payment-slip-name">{paymentSlip.name}</span>}
      </div>

      {/* Book button */}
      <button
        onClick={handleBooking}
        disabled={!selectedSlotId || !paymentSlip}
        className="book-button"
      >
        Book Selected Slot
      </button>

      {/* Booking confirmation */}
      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Pending Approval</h3>
          <p>Slot: {bookingSuccess.booking?.slot?.slotNumber}</p>
          <p>User: {currentUser?.name}</p>
          <p>Status: Pending Approval</p>
        </div>
      )}
    </div>
  );
};

export default BookSlot;
