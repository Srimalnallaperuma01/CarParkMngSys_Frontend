// src/components/UsersAdminList.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; // centralized axios with token
import QRCode from "react-qr-code";
import "./UsersAdminList.css";

const UsersAdminList = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]); // store all bookings
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users and bookings
  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await axios.get("/admin/users");
      const bookingsRes = await axios.get("/bookings/all"); // fetch all bookings
      setUsers(usersRes.data || []);
      setBookings(bookingsRes.data.bookings || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users or bookings. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  // Filter users by name or NIC
  const filteredUsers = users.filter((user) => {
    const name = (user.username || user.name || "").toLowerCase();
    const nic = (user.nic || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || nic.includes(search);
  });

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="users-admin-list-container">
      <h2>Users & Admins</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or NIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="users-table">
        <tr>
          <th>Name</th>
          <th>NIC</th>
          <th>Role</th>
          <th>Email</th>
          <th>Vehicle</th>
          <th>Booked Slots</th>
          <th>QR Code</th>
          <th>Actions</th>
        </tr>

        {filteredUsers.length === 0 ? (
          <tr>
            <td colSpan="8">No users found.</td>
          </tr>
        ) : (
          filteredUsers.map((user) => {
            // Filter only bookings for this specific user
            const userBookings = bookings.filter(
              (b) => b.customer && b.customer._id === user._id
            );

            return (
              <tr key={user._id}>
                <td>{user.username || user.name || "-"}</td>
                <td>{user.nic || "-"}</td>
                <td>{user.role || "user"}</td>
                <td>{user.email || "-"}</td>
                <td>{user.vehicleNumber || "-"}</td>

                <td>
                  {userBookings.length > 0 ? (
                    userBookings.map((b, idx) => {
                      const slotNumber =
                        b.slot?.slotNumber || b.slot?.name || b.slotName || "Slot";
                      const date = b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString()
                        : "-";
                      const status = b.status || "-";
                      return (
                        <div key={idx}>
                          {slotNumber} - {date} ({status})
                        </div>
                      );
                    })
                  ) : (
                    "No bookings"
                  )}
                </td>

                <td>
                  <QRCode value={user.qrCode || user._id || ""} size={64} />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </table>
    </div>
  );
};

export default UsersAdminList;
