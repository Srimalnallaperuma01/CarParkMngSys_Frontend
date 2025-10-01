import React, { useContext, useEffect, useState } from "react";
import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import "./AdminDashboard.css";

// Recharts imports
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const { currentUser, logoutUser } = useContext(UserContext);
  const location = useLocation(); // ✅ get current path

  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedBookings: 0,
    availableSlots: 0,
    pendingApprovals: 0,
  });

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Protect: Only logged-in admins
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return <Navigate to="/login" />;
  }

  const pieData = [
    { name: "Approved Bookings", value: stats.approvedBookings },
    { name: "Pending Approvals", value: stats.pendingApprovals },
    { name: "Available Slots", value: stats.availableSlots },
    { name: "Total Users", value: stats.totalUsers },
  ];

  // Only show home details if current path is exactly /admin
  const showHomeDetails = location.pathname === "/admin";

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li><Link to="/admin">Home</Link></li>
          <li><Link to="/admin/users">Users & Admins</Link></li>
          <li><Link to="/admin/bookings">Bookings</Link></li>
          <li><Link to="/admin/slots">Manage Slots</Link></li>
          <li><button onClick={logoutUser}>Logout</button></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="admin-dashboard-content">
        {showHomeDetails && (
          <>
            <div className="dashboard-header">
              <h2>Welcome, {currentUser.name}</h2>
              <p>Role: {currentUser.role}</p>
            </div>

            {/* Dashboard Cards */}
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="card">
                <h3>Approved Bookings</h3>
                <p>{stats.approvedBookings}</p>
              </div>
              <div className="card">
                <h3>Available Slots</h3>
                <p>{stats.availableSlots}</p>
              </div>
              <div className="card">
                <h3>Pending Approvals</h3>
                <p>{stats.pendingApprovals}</p>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="dashboard-chart" style={{ width: "100%", height: 300, marginTop: 40 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Render nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
