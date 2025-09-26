// src/components/AdminBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const AdminBookings = () => {
  const { currentUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/bookings`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_URL}/admin/bookings/${bookingId}`, { status });
      setBookings(bookings.map(b => (b._id === bookingId ? { ...b, status } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/admin/bookings/${bookingId}`);
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
                <td>{b.slot.slotNumber}</td>
                <td>{b.customer ? b.customer.name : b.guestName}</td>
                <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
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
