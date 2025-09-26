import React, { useEffect, useState, useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import BackButton from "./BackButton";
import { SlotsContext } from "../context/SlotContext";
import axios from "axios";

const MyBookings = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [bookings, setBookings] = useState([]);
  const qrRefs = useRef({});

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const downloadQR = (id) => {
    const qrDiv = qrRefs.current[id];
    if (!qrDiv) return;
    html2canvas(qrDiv).then(canvas => {
      canvas.toBlob(blob => saveAs(blob, `QR_${id}.png`));
    });
  };

  const cancelBooking = async (booking) => {
    try {
      // Call backend to cancel
      await axios.delete(`${process.env.REACT_APP_API_URL}/bookings/${booking._id}`);
      
      // Update frontend
      setBookings(bookings.filter(b => b._id !== booking._id));
      setSlotsData(slotsData.map(slot =>
        slot.id === booking.slot ? { ...slot, status: "available" } : slot
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="mybookings-container">
      <BackButton />
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          Slot: {b.slot}, Date: {b.date}, Time: {b.time}
          <div ref={el => (qrRefs.current[b._id] = el)} style={{ display: "inline-block", marginLeft: "10px" }}>
            <QRCodeCanvas value={b.qr} size={100} />
          </div>
          <button onClick={() => downloadQR(b._id)}>Download QR</button>
          <button
            onClick={() => cancelBooking(b)}
            style={{ marginLeft: "10px", background: "#f44336", color: "#fff" }}
          >
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
