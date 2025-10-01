// src/components/Payments.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/bookings");
        const bookings = res.data.bookings || res.data;

        // Include all bookings that have a payment slip or approved booking
        const relevantBookings = bookings.filter(
          (b) => b.paymentSlip || b.status?.toLowerCase() === "approved"
        );

        setPayments(relevantBookings);
        setError(null);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "#facc15"; // yellow
      case "approved":
      case "received":
        return "#22c55e"; // green
      case "rejected":
        return "#ef4444"; // red
      default:
        return "#94a3b8"; // gray
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (payments.length === 0) return <p>No bookings/payment slips available.</p>;

  return (
    <div className="payments-container">
      <h2>My Payments</h2>
      <ul>
        {payments.map((b) => {
          const slotStatus = b.status?.toLowerCase() || "pending";
          const paymentStatus =
            slotStatus === "approved" ? "Received" : b.paymentStatus || "Pending";

          const bookingDate = b.bookingDate
            ? new Date(b.bookingDate)
            : b.date
            ? new Date(b.date)
            : null;

          return (
            <li
              key={b._id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                borderLeft: `6px solid ${getStatusColor(slotStatus)}`,
              }}
            >
              <p>
                <strong>Booking ID:</strong> {b._id}
              </p>
              <p>
                <strong>Slot:</strong> {b.slot?.slotNumber || b.slot?.name || "-"} |{" "}
                {bookingDate && (
                  <>
                    <strong>Date:</strong> {bookingDate.toLocaleDateString()} |{" "}
                    <strong>Time:</strong> {bookingDate.toLocaleTimeString()}
                  </>
                )}
              </p>
              <p>
                <strong>Slot Status:</strong>{" "}
                <span style={{ color: getStatusColor(slotStatus), fontWeight: "bold" }}>
                  {slotStatus.charAt(0).toUpperCase() + slotStatus.slice(1)}
                </span>
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span style={{ color: getStatusColor(paymentStatus), fontWeight: "bold" }}>
                  {paymentStatus}
                </span>
              </p>
              {b.paymentSlip && (
                <p>
                  <strong>Slip:</strong>{" "}
                  <a href={b.paymentSlip} target="_blank" rel="noopener noreferrer">
                    View / Download
                  </a>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Payments;
