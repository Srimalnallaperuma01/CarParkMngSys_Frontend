// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const [slotsData, setSlotsData] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axiosInstance.get("/bookings");
        const bookings = res.data.bookings || res.data;

        // Only include pending or approved bookings
        const filteredBookings = bookings.filter((b) =>
          ["pending", "approved"].includes(b.status.toLowerCase())
        );

        // Map slots with slot number, status, and date
        const mappedSlots = filteredBookings.map((b) => ({
          id: b.slot?.slotNumber || b.slot?.name || "Unknown",
          status: b.status.toLowerCase(),
          date: b.date ? new Date(b.date).toLocaleDateString() : null,
          payment: b.paymentSlip ? "Received" : "Not Received",
        }));

        setSlotsData(mappedSlots);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchSlots();
  }, []);

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "booked":
        return "Approved";
      case "pending":
        return "Pending Approval";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "booked":
        return "slot-booked";
      case "pending":
        return "slot-pending";
      default:
        return "slot-unknown";
    }
  };

  return (
    <div className="dashboard-container">
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

      <main className="dashboard-main">
        <div className="slots-preview">
          {slotsData.length === 0 ? (
            <p>No pending or approved bookings yet.</p>
          ) : (
            slotsData.map((slot, idx) => (
              <div
                key={idx}
                className={`slot-card ${getStatusClass(slot.status)}`}
                title={`Slot ${slot.id} - ${formatStatus(slot.status)}${
                  slot.date ? ` - ${slot.date}` : ""
                } - Payment: ${slot.payment}`}
              >
                <span className="slot-id">{slot.id}</span>
                {slot.date && <small className="slot-date">{slot.date}</small>}
                <small className="slot-status">{formatStatus(slot.status)}</small>
                <small className="slot-payment">Payment: {slot.payment}</small>
              </div>
            ))
          )}
        </div>

        <Outlet context={{ slotsData, setSlotsData }} />
      </main>
    </div>
  );
};

export default Dashboard;
