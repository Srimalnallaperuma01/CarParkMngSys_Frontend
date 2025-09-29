import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./CheckAvailability.css";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "available":
      return "#28a745"; // Green
    case "booked":
      return "#dc3545"; // Red
    case "pending":
      return "#FFC107"; // Yellow
    default:
      return "#6c757d"; // Grey
  }
};

const CheckAvailability = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking"); // backend route
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();

    // Polling every 3 seconds
    const interval = setInterval(() => fetchSlots(), 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="availability-container">
        <p className="loading-text">Loading slots...</p>
      </div>
    );

  return (
    <div className="availability-container">
      <h2>Check Slot Availability</h2>
      <div className="slots-card-grid">
        {slotsData.map((slot) => (
          <div
            key={slot._id || slot.id}
            className="slot-card"
            style={{ backgroundColor: getStatusColor(slot.status) }}
          >
            <span className="slot-number">{slot.slotNumber || slot.id}</span>
            <span
              className="slot-status"
              style={{
                color: slot.status.toLowerCase() === "pending" ? "#333" : "#fff",
              }}
            >
              {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
            </span>
            <span className="slot-price">{slot.price ? `LKR ${slot.price}` : "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckAvailability;
