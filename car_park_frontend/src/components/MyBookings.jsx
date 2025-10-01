// src/components/MyBookings.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { SlotsContext } from "../context/SlotContext";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";
import "./MyBookings.css";

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
    case "approved": return "#22c55e";
    case "cancelled": return "#6c757d";
    default: return "#94a3b8";
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

  const generateTicketPDF = async (booking) => {
    const ticketDiv = qrRefs.current[booking._id];
    if (!ticketDiv) return;

    const canvas = await html2canvas(ticketDiv, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Parkly_Ticket_${booking._id}.pdf`);
  };

  return (
    <div className="mybookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p className="no-bookings">No bookings yet.</p>}

      {bookings.map((b) => {
        const status = normalizeStatus(b.status);
        const bookingDate = b.bookingDate ? new Date(b.bookingDate) : null;

        return (
          <div key={b._id} className="booking-card">
            {/* Booking Strip */}
            <div className="booking-strip" onClick={() => status === "approved" && window.open(`/ticket/${b._id}`)}>
              <strong>{b.slot?.slotNumber || "N/A"}</strong> | {bookingDate?.toLocaleDateString()} {bookingDate?.toLocaleTimeString()} | 
              <span className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {/* Ticket Card (hidden/used for PDF) */}
            {status === "approved" && (
              <div ref={(el) => (qrRefs.current[b._id] = el)} className="ticket-card">
                <h2>Parkly</h2>
                <p><em>"Your trusted parking partner"</em></p>
                <hr />
                <h3>Entrance Ticket</h3>
                <p><strong>User:</strong> {currentUser.name} | {currentUser.email}</p>
                <p><strong>Slot:</strong> {b.slot?.slotNumber || "N/A"}</p>
                <p><strong>Date:</strong> {bookingDate.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {bookingDate.toLocaleTimeString()}</p>
                <p><strong>Booking ID:</strong> {b._id}</p>
                <QRCodeCanvas value={b.qrCode || b._id} size={128} />
                <p style={{ marginTop: "10px", fontStyle: "italic" }}>"Park smart, park safely!"</p>
              </div>
            )}

            {/* Booking Actions */}
            <div className="booking-actions">
              {status === "approved" && (
                <button className="btn-ticket" onClick={() => generateTicketPDF(b)}>Download Ticket PDF</button>
              )}
              {status === "pending" && (
                <button className="btn-cancel" onClick={() => cancelBooking(b)}>Cancel Booking</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
