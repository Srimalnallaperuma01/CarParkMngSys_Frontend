// src/components/AdminBookings.jsx
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AdminBooking.css";

// Normalize status to handle undefined
const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (["pending", "approved", "rejected", "cancelled"].includes(s)) return s;
  return "unknown";
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "pending":
      return "#FFC107"; // orange
    case "approved":
      return "#28a745"; // green
    case "rejected":
    case "cancelled":
      return "#6c757d"; // grey
    default:
      return "#6c757d";
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bookings from API
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

  // Approve / Reject booking
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

  // Cancel booking
  const cancelBooking = async (id) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert("Failed to cancel booking.");
    }
  };

  // Open payment slip in new tab
  const viewSlip = (filePath) => {
    const url = filePath.startsWith("http") ? filePath : `${window.location.origin}/${filePath}`;
    window.open(url, "_blank");
  };

  // Filtered bookings
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
          <thead>
            <tr>
              <th>Slot</th>
              <th>User/Guest</th>
              <th>NIC</th>
              <th>Vehicle Number</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment Slip</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => {
              const status = normalizeStatus(b.status);

              return (
                <tr key={b._id}>
                  <td>{b.slot?.slotNumber || "N/A"}</td>
                  <td>{b.customer?.username || b.guestName || "Guest"}</td>
                  <td>{b.customer?.nic || b.customer?.NIC || b.nic || "N/A"}</td>
                  <td>{b.vehicleNumber || b.customer?.vehicleNumber || "N/A"}</td>
                  <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"}</td>
                  <td style={{ color: getStatusColor(status) }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </td>
                  <td>
                    {b.paymentSlip ? (
                      <button
                        onClick={() => viewSlip(b.paymentSlip)}
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
                    {/* Approve / Reject only if pending and slip exists */}
                    {status === "pending" && b.paymentSlip && (
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
                    {/* Cancel button for approved or pending */}
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
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
