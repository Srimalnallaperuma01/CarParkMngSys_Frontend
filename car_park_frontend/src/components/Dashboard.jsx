import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();

  const [slotsData, setSlotsData] = useState([
    { id: "A1", status: "available" },
    { id: "A2", status: "booked" },
    { id: "B1", status: "available" },
    { id: "B2", status: "pending" },
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <nav className="dashboard-nav">
        <h3>User Dashboard</h3>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname.includes("/book-slot") ? "active" : ""}>
            <Link to="/dashboard/book-slot">Book Slot</Link>
          </li>
          <li className={location.pathname.includes("/my-bookings") ? "active" : ""}>
            <Link to="/dashboard/my-bookings">My Bookings</Link>
          </li>
          <li className={location.pathname.includes("/payments") ? "active" : ""}>
            <Link to="/dashboard/payments">Payments</Link>
          </li>
          <li className={location.pathname.includes("/notifications") ? "active" : ""}>
            <Link to="/dashboard/notifications">Notifications</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Welcome to Your Dashboard</h2>
        <p>Select an option from the sidebar to get started.</p>
        <div className="slots-preview">
          {slotsData.map((slot) => (
            <div
              key={slot.id}
              className={`slot-card ${slot.status}`}
              title={`Slot ${slot.id} - ${slot.status}`}
            >
              <span>{slot.id}</span>
              <small>{slot.status}</small>
            </div>
          ))}
        </div>

        {/* Nested routes */}
        <Outlet context={{ slotsData, setSlotsData }} />
      </main>
    </div>
  );
};

export default Dashboard;
