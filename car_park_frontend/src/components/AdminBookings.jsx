// src/components/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AdminBooking.css";

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
    case "pending": return "#FFC107";   // orange
    case "approved": return "#dc3545";  // red
    case "cancelled": return "#6c757d"; // grey
    default: return "#6c757d";
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/admin/bookings");
      const data = Array.isArray(res.data) ? res.data : res.data.bookings || [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosInstance.patch(`/admin/bookings/${id}`, { status });
      setBookings(prev =>
        prev.map(b => b._id === id ? { ...b, status: res.data.booking?.status || status } : b)
      );
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axiosInstance.delete(`/admin/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="admin-bookings-container">
      <h3>All Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          
            <tr>
              <th>Slot</th>
              <th>User/Guest</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment Slip</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.slot?.slotNumber || "N/A"}</td>
                <td>{b.customer?.name || b.customer?.username || b.guestName || "Guest"}</td>
                <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"}</td>
                <td style={{ color: getStatusColor(b.status) }}>
                  {normalizeStatus(b.status).charAt(0).toUpperCase() + normalizeStatus(b.status).slice(1)}
                </td>
                <td>
                  {b.paymentSlip ? (
                    <a
                      href={`http://localhost:5000/uploads/payments/${b.paymentSlip}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : "No Slip"}
                </td>
                <td>
                  {b.qrCode ? <img src={b.qrCode} alt="QR" style={{ width: 50, height: 50 }} /> : "N/A"}
                </td>
                <td>
                  {normalizeStatus(b.status) === "pending" && (
                    <>
                      <button onClick={() => updateStatus(b._id, "approved")}>Approve</button>
                      <button onClick={() => updateStatus(b._id, "cancelled")}>Reject</button>
                    </>
                  )}
                  <button onClick={() => cancelBooking(b._id)} style={{ marginLeft: "5px" }}>Cancel</button>
                </td>
              </tr>
            ))}
          
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
