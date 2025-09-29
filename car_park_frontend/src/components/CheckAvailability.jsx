import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./CheckAvailability.css";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "available": return "#28a745"; // Green
    case "booked": return "#dc3545";    // Red
    case "pending": return "#FFC107";   // Yellow
    default: return "#6c757d";          // Grey
  }
};

const CheckAvailability = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
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
                    color: slot.status.toLowerCase() === "pending" ? "#333" : "#fff",
                    borderRadius: "6px",
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
