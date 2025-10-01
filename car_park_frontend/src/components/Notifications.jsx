// src/components/Notifications.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch all bookings of the current user
        const res = await axiosInstance.get("/bookings");
        const bookings = res.data.bookings || res.data;

        // Filter only pending, approved, or rejected bookings
        const relevantBookings = bookings.filter((b) =>
          ["pending", "approved", "rejected"].includes(b.status.toLowerCase())
        );

        // Map into user-friendly messages
        const notes = relevantBookings.map((b) => {
          const slotName = b.slot?.slotNumber || b.slot?.name || "Unknown";
          const date = b.date ? new Date(b.date).toLocaleDateString() : "-";
          const status =
            b.status.toLowerCase() === "approved"
              ? "Booking Approved ✅"
              : b.status.toLowerCase() === "rejected"
              ? "Booking Rejected ❌"
              : "Pending Approval ⏳";

          return `${status} for Slot ${slotName} on ${date}. Payment: ${
            b.paymentSlip ? "Received" : "Not Received"
          }`;
        });

        setNotifications(notes);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications(["Failed to load notifications."]);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
