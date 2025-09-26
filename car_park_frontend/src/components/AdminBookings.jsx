// src/components/AdminBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/UserContext";

const AdminBookings = () => {
  const { currentUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/admin/bookings");
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await axiosInstance.patch(`/admin/bookings/${bookingId}`, { status });
      setBookings(bookings.map(b => (b._id === bookingId ? { ...b, status } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axiosInstance.delete(`/admin/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h3>All Bookings</h3>
      {bookings.length === 0 ? <p>No bookings found.</p> : (
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>User/Guest</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.slot?.slotNumber}</td>
                <td>{b.customer?.username || b.guestName || "Guest"}</td>
                <td>{new Date(b.bookingDate).toLocaleString()}</td>
                <td>{b.status}</td>
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
