// src/components/CheckAvailability.jsx
import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./CheckAvailability.css";

// Status color mapping
const getStatusColor = (status) => {
  if (!status) return "#6c757d"; // grey
  const s = status.toLowerCase();
  switch (s) {
    case "available": return "#28a745"; // green
    case "pending": return "#FFC107";   // yellow
    case "approved":
    case "booked": return "#dc3545";    // red
    default: return "#6c757d";          // grey
  }
};

const CheckAvailability = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) {
        // Normalize status
        const normalizedSlots = res.data.map(s => ({
          ...s,
          status: s.status ? s.status.toLowerCase() : "unknown",
        }));
        setSlotsData(normalizedSlots);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(); // fetch only once on mount
  }, []);

  if (loading) {
    return (
      <div className="availability-container">
        <p className="loading-text">Loading slots...</p>
      </div>
    );
  }

  return (
    <div className="availability-container">
      <h2>Check Slot Availability</h2>
      <div className="availability-table-container">
        <table>
          <thead>
            <tr>
              <th>Slot Number</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {slotsData.map((slot) => (
              <tr key={slot._id || slot.id}>
                <td>{slot.slotNumber || slot.id}</td>
                <td
                  style={{
                    backgroundColor: getStatusColor(slot.status),
                    color: slot.status === "pending" ? "#333" : "#fff",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </td>
                <td>{slot.price ? `LKR ${slot.price}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckAvailability;
