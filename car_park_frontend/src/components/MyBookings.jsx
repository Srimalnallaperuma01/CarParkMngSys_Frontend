// src/components/MyBookings.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import BackButton from "./BackButton";
import { SlotsContext } from "../context/SlotContext";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";

const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "approved") return "approved";
  if (s === "cancelled" || s === "rejected") return "cancelled";
  return "unknown";
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "pending": return "#FFC107";
    case "approved": return "#dc3545";
    case "cancelled": return "#6c757d";
    default: return "#6c757d";
  }
};

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
    html2canvas(qrDiv).then((canvas) => {
      canvas.toBlob((blob) => saveAs(blob, `QR_${id}.png`));
    });
  };

  const cancelBooking = async (booking) => {
    if (normalizeStatus(booking.status) !== "pending") {
      return alert("You can only cancel pending bookings.");
    }

    try {
      await axiosInstance.delete(`/bookings/${booking._id}`);
      setBookings(bookings.filter((b) => b._id !== booking._id));
      setSlotsData(
        slotsData.map((slot) =>
          slot.id === booking.slot?._id ? { ...slot, status: "available" } : slot
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Cancel failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="mybookings-container">
      <BackButton />
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((b) => {
        const status = normalizeStatus(b.status);
        return (
          <div key={b._id} className="booking-card">
            <p>
              Slot: {b.slot?.slotNumber || "N/A"} | Date:{" "}
              {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"} | Status:{" "}
              <span style={{ color: getStatusColor(status) }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </p>

            {status === "approved" && (
              <div ref={(el) => (qrRefs.current[b._id] = el)} style={{ display: "inline-block", margin: "10px" }}>
                <QRCodeCanvas value={b.qrCode || b._id} size={128} />
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              {status === "approved" && (
                <button onClick={() => downloadQR(b._id)}>Download QR</button>
              )}
              {status === "pending" && (
                <button onClick={() => cancelBooking(b)}>Cancel Booking</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
