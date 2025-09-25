import React, { useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import BackButton from "./BackButton";
import { BookingContext } from "../context/BookingContext";
import { useOutletContext } from "react-router-dom";

const MyBookings = () => {
  const { bookings, setBookings } = useContext(BookingContext);
  const { slotsData, setSlotsData } = useOutletContext(); // ✅ get slots to update availability
  const qrRefs = useRef({});

  const downloadQR = (id) => {
    const qrDiv = qrRefs.current[id];
    if (!qrDiv) return;
    html2canvas(qrDiv).then((canvas) => {
      canvas.toBlob((blob) => saveAs(blob, `QR_${id}.png`));
    });
  };

  const cancelBooking = (booking) => {
    // Remove booking
    setBookings(bookings.filter(b => b.qr !== booking.qr));

    // Update slot to available
    const updatedSlots = slotsData.map(slot =>
      slot.id === booking.slot ? { ...slot, status: "available" } : slot
    );
    setSlotsData(updatedSlots);
  };

  return (
    <div className="mybookings-container">
      <BackButton />
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          Slot: {b.slot}, Date: {b.date}, Time: {b.time}
          <div
            ref={(el) => (qrRefs.current[b.qr] = el)}
            style={{ display: "inline-block", marginLeft: "10px" }}
          >
            <QRCodeCanvas value={b.qr} size={100} />
          </div>
          <button onClick={() => downloadQR(b.qr)}>Download QR</button>
          <button onClick={() => cancelBooking(b)} style={{ marginLeft: "10px", background: "#f44336", color: "#fff" }}>
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
