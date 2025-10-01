// src/components/AdminBookings.jsx
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AdminBooking.css";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
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
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  // Filtered bookings based on search term (NIC or Vehicle Number)
  const filteredBookings = useMemo(() => {
  if (!searchTerm) return bookings;

  return bookings.filter((b) => {
    const nic =
      b.customer?.nic ||
      b.customer?.NIC ||
      b.nic ||
      ""; // fallback
    const vehicle =
      b.vehicleNumber ||
      b.customer?.vehicleNumber ||
      "";
    const slotNumber =
      b.slot?.slotNumber?.toString() || b.slot?.name?.toString() || "";

    const term = searchTerm.toLowerCase();
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
          placeholder="Search by NIC or Vehicle Number"
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
              <th>Status</th>
              <th>Payment Slip</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          
            {filteredBookings.map((b) => (
              <tr key={b._id}>
                <td>{b.slot?.slotNumber || "N/A"}</td>
                <td>{b.customer?.username || b.guestName || "Guest"}</td>
                <td>
                  {b.customer?.nic ||
                    b.customer?.NIC ||
                    b.nic ||
                    "N/A"}
                </td>
                <td>
                  {b.vehicleNumber ||
                    b.customer?.vehicleNumber ||
                    "N/A"}
                </td>
                <td>
                  {b.bookingDate
                    ? new Date(b.bookingDate).toLocaleString()
                    : "N/A"}
                </td>
                <td style={{ color: getStatusColor(b.status) }}>
                  {b.status
                    ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
                    : "N/A"}
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
                  ) : (
                    "No Slip"
                  )}
                </td>
                <td>
                  {b.qrCode ? (
                    <img
                      src={b.qrCode}
                      alt="QR"
                      style={{ width: 50, height: 50 }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {b.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(b._id, "approve")}
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(b._id, "reject")}
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(b.status.toLowerCase() === "pending" ||
                    b.status.toLowerCase() === "approved") && (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      style={{ backgroundColor: "#6c757d", color: "#fff" }}
                    >
                      Cancel
                    </button>
                  )}
                  {b.status.toLowerCase() === "rejected" && (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      style={{ backgroundColor: "#6c757d", color: "#fff" }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
