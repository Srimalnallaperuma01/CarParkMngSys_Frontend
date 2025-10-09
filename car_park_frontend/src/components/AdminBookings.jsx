// src/components/AdminBookings.jsx
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AdminBooking.css";

const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (["pending", "approved", "rejected", "cancelled"].includes(s)) return s;
  return "unknown";
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "pending":
      return "#FFC107";
    case "approved":
      return "#28a745";
    case "rejected":
    case "cancelled":
      return "#6c757d";
    default:
      return "#6c757d";
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings/all");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, type) => {
    try {
      const url =
        type === "approve" ? `/bookings/${id}/approve` : `/bookings/${id}/reject`;
      const res = await axiosInstance.put(url);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data.booking : b))
      );
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert("Failed to update status.");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert("Failed to cancel booking.");
    }
  };

  // Inside AdminBookings component, add this helper function
const calculateCost = (booking) => {
  const baseCost = 100; // base cost for first 24 hours (example)
  if (!booking.bookingDate || !booking.endDate) return baseCost;

  const start = new Date(booking.bookingDate);
  const end = new Date(booking.endDate);
  const diffMs = end - start; // difference in milliseconds
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // convert to days

  // Add extra 50 LKR per extra 24 hours beyond first day
  const extraCost = diffDays > 1 ? (diffDays - 1) * 50 : 0;
  return baseCost + extraCost;
};




  // ✅ FIXED: open signed S3 URL directly
  const viewSlip = (url) => {
    if (!url) return alert("No payment slip available.");
    window.open(url, "_blank");
  };

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const nic = b.customer?.nic || b.customer?.NIC || b.nic || "";
      const vehicle = b.vehicleNumber || b.customer?.vehicleNumber || "";
      const slotNumber = b.slot?.slotNumber?.toString() || b.slot?.name?.toString() || "";
      return (
        nic.toLowerCase().includes(term) ||
        vehicle.toLowerCase().includes(term) ||
        slotNumber.toLowerCase().includes(term)
      );
    });
  }, [bookings, searchTerm]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="admin-bookings-container">
      <h3>All Bookings</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by NIC, Vehicle or Slot"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
  <tr>
    <th>Slot</th>
    <th>User/Guest</th>
    <th>NIC</th>
    <th>Vehicle Number</th>
    <th>Date</th>
    <th>Cost (LKR)</th> {/* New column */}
    <th>Status</th>
    <th>Payment Slip</th>
    <th>QR Code</th>
    <th>Actions</th>
  </tr>

  {filteredBookings.map((b) => {
    const status = normalizeStatus(b.status);
    const cost = calculateCost(b); // calculate cost here

    return (
      <tr key={b._id}>
        <td>{b.slot?.slotNumber || "N/A"}</td>
        <td>{b.customer?.username || b.guestName || "Guest"}</td>
        <td>{b.customer?.nic || b.customer?.NIC || b.nic || "N/A"}</td>
        <td>{b.vehicleNumber || b.customer?.vehicleNumber || "N/A"}</td>
        <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"}</td>
        <td>{cost}</td> {/* Show calculated cost */}
        <td style={{ color: getStatusColor(status) }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </td>
        <td>
          {b.paymentSlipUrl ? (
            <button
              onClick={() => viewSlip(b.paymentSlipUrl)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              View / Download
            </button>
          ) : (
            "No Slip"
          )}
        </td>
        <td>
          {b.qrCode ? (
            <img src={b.qrCode} alt="QR" style={{ width: 50, height: 50 }} />
          ) : (
            "N/A"
          )}
        </td>
        
        <td>
          {status === "pending" && b.paymentSlipUrl && (
            <>
              <button
                onClick={() => updateStatus(b._id, "approve")}
                style={{ marginRight: "5px", backgroundColor: "#28a745", color: "#fff" }}
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(b._id, "reject")}
                style={{ marginRight: "5px", backgroundColor: "#dc3545", color: "#fff" }}
              >
                Reject
              </button>
            </>
          )}
          {(status === "pending" || status === "approved" || status === "rejected") && (
            <button
              onClick={() => cancelBooking(b._id)}
              style={{ backgroundColor: "#6c757d", color: "#fff" }}
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
    );
  })}
</table>

      )}
    </div>
  );
};

export default AdminBookings;
