// src/components/MyBookings.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import BackButton from "./BackButton";
import { SlotsContext } from "../context/SlotContext";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";

const MyBookings = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const { currentUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const qrRefs = useRef({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/bookings");
        setBookings(response.data.bookings || response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const downloadQR = (id) => {
    const qrDiv = qrRefs.current[id];
    if (!qrDiv) return;
    html2canvas(qrDiv).then(canvas => {
      canvas.toBlob(blob => saveAs(blob, `QR_${id}.png`));
    });
  };

  const cancelBooking = async (booking) => {
    try {
      await axiosInstance.delete(`/bookings/${booking._id}`);
      setBookings(bookings.filter(b => b._id !== booking._id));
      setSlotsData(slotsData.map(slot => slot.slotNumber === booking.slot ? { ...slot, status: "Available" } : slot));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="mybookings-container">
      <BackButton />
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b._id} className="booking-card">
          <p>Slot: {b.slot?.slotNumber || b.slot} | Date: {new Date(b.bookingDate).toLocaleString()}</p>
          <div ref={el => (qrRefs.current[b._id] = el)} style={{ display: "inline-block", margin: "10px" }}>
            <QRCodeCanvas value={b.qrCode || `booking:${b._id}`} size={100} />
          </div>
          {b.paymentSlip && (
            <div>
              <p>Payment Slip:</p>
              <img src={`http://localhost:5000/${b.paymentSlip}`} alt="Payment Slip" style={{ maxWidth: "200px" }} />
            </div>
          )}
          <button onClick={() => downloadQR(b._id)}>Download QR</button>
          <button onClick={() => cancelBooking(b)} style={{ marginLeft: "10px", background: "#f44336", color: "#fff" }}>
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
