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
  const [paymentSlip, setPaymentSlip] = useState(null);

  useEffect(() => {
    if (!currentUser) navigate("/login");
    fetchSlots();
    // eslint-disable-next-line
  }, [currentUser]);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      setSlots(res.data);
    } catch (err) {
      alert("Error fetching slots: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return alert("Please select a slot!");
    if (!paymentSlip) return alert("Please upload a payment slip!");

    try {
      // 1️⃣ Create booking
      const bookingRes = await axiosInstance.post("/bookings", {
        slotId: selectedSlot.slotNumber // send slotNumber
      });

      const bookingId = bookingRes.data.booking._id;

      // 2️⃣ Upload payment slip
      const formData = new FormData();
      formData.append("slip", paymentSlip);

      await axiosInstance.post(`/bookings/${bookingId}/upload-slip`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setBookingSuccess(bookingRes.data);
      fetchSlots();
      setSelectedSlot(null);
      setPaymentSlip(null);
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
            className={`slot-card ${slot.status.toLowerCase()} ${
              selectedSlot === slot ? "selected" : ""
            }`}
            onClick={() => slot.status === "Available" && setSelectedSlot(slot)}
          >
            {slot.slotNumber} ({slot.status})
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPaymentSlip(e.target.files[0])}
        style={{ marginTop: "10px" }}
      />

      <button
        onClick={handleBooking}
        disabled={!selectedSlot || !paymentSlip}
        className="book-button"
      >
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
