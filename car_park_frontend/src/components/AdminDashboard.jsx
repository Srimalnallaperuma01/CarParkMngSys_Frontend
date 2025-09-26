// src/components/AdminDashboard.jsx
import React, { useContext } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser } = useContext(UserContext);

  // Protect: Only logged-in admins
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="admin-dashboard-container">
      <nav className="sidebar">
        <h3><Link to="/admin">Admin Panel</Link></h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="bookings">Bookings</Link></li>
          <li><Link to="slots">Manage Slots</Link></li>
        </ul>
      </nav>

      <main className="admin-dashboard-content">
        <h2>Welcome, {currentUser.name}</h2>
        <p>Role: {currentUser.role}</p>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
