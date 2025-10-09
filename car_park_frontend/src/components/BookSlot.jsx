// src/components/BookSlot.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";
import { SlotsContext } from "../context/SlotContext";
import "./BookSlot.css";

// Normalize slot status
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
    case "available":
      return "#28a745";
    case "pending":
      return "#FFC107";
    case "booked":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

const BookSlot = () => {
  const { currentUser } = useContext(UserContext);
  const { slotsData, fetchSlots } = useContext(SlotsContext);
  const navigate = useNavigate();

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchSlots();
  }, [currentUser, navigate, fetchSlots]);

  // Handle booking
  const handleBooking = async () => {
    if (!selectedSlotId) return alert("Please select a slot!");
    if (!paymentSlip) return alert("Please upload a payment slip!");
    if (!bookingDateTime) return alert("Please select a booking date and time!");

    const selectedDate = new Date(bookingDateTime);
    const now = new Date();
    if (selectedDate < now) return alert("Cannot select past date/time!");

    try {
      setUploading(true);

      // 1️⃣ Create booking with date
      const bookingRes = await axiosInstance.post("/bookings", {
        slotId: selectedSlotId,
        bookingDate: bookingDateTime,
      });
      const booking = bookingRes.data.booking;
      if (!booking || !booking._id) throw new Error("Booking creation failed");

      const bookingId = booking._id;

      // 2️⃣ Upload payment slip
      const formData = new FormData();
      formData.append("slip", paymentSlip);
      const uploadRes = await axiosInstance.post(
        `/bookings/${bookingId}/upload-slip`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // 3️⃣ Get updated booking
      setBookingSuccess(uploadRes.data.booking);

      // Reset selection & fetch slots again
      fetchSlots();
      setSelectedSlotId(null);
      setPaymentSlip(null);
      setBookingDateTime("");

      alert("Booking successful! Payment slip uploaded.");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Open payment slip in new tab
  const viewSlip = (filePath) => {
    const url = filePath.startsWith("http") ? filePath : `${window.location.origin}/${filePath}`;
    window.open(url, "_blank");
  };

  return (
    <div className="book-slot-container">
      <h2>Book a Parking Slot</h2>

      {/* Slots Grid */}
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

      {/* Booking Date & Time */}
      <div className="booking-datetime-section">
        <label htmlFor="booking-datetime">Select Booking Date & Time:</label>
        <input
          type="datetime-local"
          id="booking-datetime"
          value={bookingDateTime}
          onChange={(e) => setBookingDateTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)} // prevent past datetime
        />
      </div>

      {/* Payment Slip Upload */}
      <div className="payment-slip-section">
        <label htmlFor="payment-slip" className="payment-slip-label">
          Upload Payment Slip
        </label>
        <input
          type="file"
          id="payment-slip"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setPaymentSlip(e.target.files[0])}
          className="payment-slip-input"
        />
        {paymentSlip && <span className="payment-slip-name">{paymentSlip.name}</span>}
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={!selectedSlotId || !paymentSlip || !bookingDateTime || uploading}
        className="book-button"
      >
        {uploading ? "Booking & Uploading..." : "Book Selected Slot"}
      </button>

      {/* Booking Confirmation */}
      {bookingSuccess && (
        <div className="booking-confirmation">
          <h3>Booking Pending Approval</h3>
          <p>Slot: {bookingSuccess.slot?.slotNumber}</p>
          <p>User: {currentUser?.name}</p>
          <p>Status: Pending Approval</p>
          <p>Date & Time: {new Date(bookingSuccess.bookingDate).toLocaleString()}</p>

          {/* View Payment Slip */}
          {bookingSuccess.paymentSlip && (
            <p>
              <strong>Payment Slip:</strong>{" "}
              <button
                className="btn-view-slip"
                onClick={() => viewSlip(bookingSuccess.paymentSlip)}
              >
                View / Download
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSlot;
