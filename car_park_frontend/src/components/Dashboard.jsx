import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";


const Dashboard = () => {
  const [slotsData, setSlotsData] = useState([
    { id: "A1", status: "available" },
    { id: "A2", status: "booked" },
    { id: "B1", status: "available" },
    { id: "B2", status: "pending" }
  ]);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <Link to="/">Home</Link>
        <Link to="/dashboard/book-slot">Book Slot</Link>
        <Link to="/dashboard/my-bookings">My Bookings</Link>
        <Link to="/dashboard/payments">Payments</Link>
        <Link to="/dashboard/notifications">Notifications</Link>
      </nav>

      <main className="dashboard-main">
        {/* Pass slotsData and setter as context to nested routes */}
        <Outlet context={{ slotsData, setSlotsData }} />
      </main>
    </div>
  );
};

export default Dashboard;
