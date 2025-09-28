import React, { useContext } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser, logoutUser } = useContext(UserContext);

  // Protect: Only logged-in admins
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/admin/users">Users & Admins</Link>
          </li>
          <li>
            <Link to="/admin/bookings">Bookings</Link>
          </li>
          <li>
            <Link to="/admin/slots">Manage Slots</Link>
          </li>
          <li>
            <button
              onClick={() => {
                logoutUser();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="admin-dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {currentUser.name}</h2>
          <p>Role: {currentUser.role}</p>
        </div>

        {/* Nested routes render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
