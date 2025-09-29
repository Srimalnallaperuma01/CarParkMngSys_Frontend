import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./AvailabilityTable.css";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "available":
      return "#28a745"; // green
    case "booked":
      return "#dc3545"; // red
    case "pending":
      return "#FFC107"; // yellow
    default:
      return "#6c757d"; // grey
  }
};

const AvailabilityTable = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", color: "#333" }}>Loading slots...</p>;

  return (
    <div className="availability-table-container">
      <h2>Slot Availability</h2>
      <table>
        <thead>
          <tr>
            <th>Slot Number</th>
            <th>Status</th>
            <th>Price (LKR)</th>
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
                  textAlign: "center",
                  fontWeight: 600,
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
  );
};

export default AvailabilityTable;
