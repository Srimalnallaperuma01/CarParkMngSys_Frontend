import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AdminBooking.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/admin/bookings");
      // normalize response
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
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: res.data.booking?.status || status } : b)));
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
          <thead>
            <tr>
              <th>Slot</th>
              <th>User/Guest</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment Slip</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.slot?.name || b.slot?.slotNumber || "N/A"}</td>
                <td>{b.customer?.username || b.customer?.name || b.guestName || "Guest"}</td>
                <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"}</td>
                <td>{b.status || "Pending"}</td>
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
                  {b.status !== "approved" && (
                    <button onClick={() => updateStatus(b._id, "approved")}>Approve</button>
                  )}
                  <button onClick={() => cancelBooking(b._id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
