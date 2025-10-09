// src/components/MyBookings.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SlotsContext } from "../context/SlotContext";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";
import "./MyBookings.css";

// Helper functions
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
    case "pending":
      return "#FFC107";
    case "approved":
      return "#22c55e";
    case "cancelled":
      return "#6c757d";
    default:
      return "#94a3b8";
  }
};

const MyBookings = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const { currentUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const qrRefs = useRef({});

  // Fetch bookings for the logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/bookings");
        setBookings(res.data.bookings || res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    if (currentUser) fetchBookings();
  }, [currentUser]);

  // Cancel a booking
  const cancelBooking = async (booking) => {
    if (normalizeStatus(booking.status) !== "pending") {
      return alert("You can only cancel pending bookings.");
    }
    try {
      await axiosInstance.delete(`/bookings/${booking._id}`);
      setBookings(bookings.filter((b) => b._id !== booking._id));

      // Update slots locally
      setSlotsData(
        slotsData.map((slot) =>
          slot.id === booking.slot?._id ? { ...slot, status: "available" } : slot
        )
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.response?.data?.message || err.message || "Cancel failed");
    }
  };

  // Generate PDF ticket
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

  // Open payment slip in a new tab
  const viewSlip = (filePath) => {
    const url = filePath.startsWith("http") ? filePath : `${window.location.origin}/${filePath}`;
    window.open(url, "_blank");
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
            <div className="booking-strip">
              <strong>{b.slot?.slotNumber || "N/A"}</strong> |{" "}
              {bookingDate?.toLocaleDateString()} {bookingDate?.toLocaleTimeString()} |{" "}
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {/* Payment slip button */}
            {/*b.paymentSlip && (
              <p>
                <strong>Payment Slip:</strong>{" "}
                <button
                  className="btn-view-slip"
                  onClick={() => viewSlip(b.paymentSlip)}
                >
                  View / Download
                </button>
              </p>
            )*/}

            {/* Hidden ticket card for PDF */}
            {status === "approved" && (
              <div ref={(el) => (qrRefs.current[b._id] = el)} className="ticket-card">
                <h2>Parkly</h2>
                <p>
                  <em>"Your trusted parking partner"</em>
                </p>
                <hr />
                <h3>Entrance Ticket</h3>
                <p>
                  <strong>User:</strong> {currentUser.username} | {currentUser.email}
                </p>
                <p>
                  <strong>Slot:</strong> {b.slot?.slotNumber || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {bookingDate.toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {bookingDate.toLocaleTimeString()}
                </p>
                <p>
                  <strong>Booking ID:</strong> {b._id}
                </p>

                {/* Include payment slip if available */}
                {/*b.paymentSlip && (
                  <p>
                    <strong>Payment Slip:</strong>{" "}
                    <button
                      className="btn-view-slip"
                      onClick={() => viewSlip(b.paymentSlip)}
                    >
                      View / Download
                    </button>
                  </p>
                )*/}

                <QRCodeCanvas value={b.qrCode || b._id} size={128} />
                <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                  "Park smart, park safely!"
                </p>
              </div>
            )}

            {/* Booking actions */}
            <div className="booking-actions">
              {status === "approved" && (
                <button className="btn-ticket" onClick={() => generateTicketPDF(b)}>
                  Download Ticket PDF
                </button>
              )}
              {status === "pending" && (
                <button className="btn-cancel" onClick={() => cancelBooking(b)}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
