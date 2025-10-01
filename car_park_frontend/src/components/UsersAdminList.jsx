// src/components/UsersAdminList.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; // Use centralized axios with token
import QRCode from "react-qr-code";
import "./UsersAdminList.css";

const UsersAdminList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users and admins
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/users"); // backend endpoint
      setUsers(res.data || []); // ensure array
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      // Remove deleted user from state
      setUsers(users.filter((u) => u._id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  // Filter users/admins by Name or NIC safely
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
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username || user.name || "-"}</td>
                <td>{user.nic || "-"}</td>
                <td>{user.role || "user"}</td>
                <td>{user.email || "-"}</td>
                <td>{user.vehicleNumber || "-"}</td>
                <td>
  {user.bookings && user.bookings.length > 0 ? (
    <ul>
      {user.bookings.map((b, idx) => (
        <li key={idx}>
          {b.slotName || b.slot?.name || "Slot"} -{" "}
          {b.date ? new Date(b.date).toLocaleDateString() : "-"} (
          {b.status || "-"})
        </li>
      ))}
    </ul>
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
            ))
          )}
        
      </table>
    </div>
  );
};

export default UsersAdminList;
