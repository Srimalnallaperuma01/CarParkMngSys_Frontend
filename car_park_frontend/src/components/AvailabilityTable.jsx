import React, { useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./AvailabilityTable.css";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "available": return "#28a745";
    case "booked": return "#dc3545";
    case "pending": return "#FFC107";
    default: return "#6c757d";
  }
};

const AvailabilityTable = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setLoading(false);
    }
  }, [setSlotsData]);

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, [fetchSlots]);

  if (loading) return <p style={{ textAlign: "center", color: "#333" }}>Loading slots...</p>;

  return (
    <div className="availability-table-container">
      <h2>Slot Availability</h2>
      <table>
        <thead>
          <tr>
            <th className="slot-id">Slot Number</th>
            <th className="status">Status</th>
            <th className="price">Price (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {slotsData.map((slot) => (
            <tr key={slot._id || slot.id}>
              <td className="slot-id">{slot.slotNumber || slot.id}</td>
              <td
                className="status"
                style={{
                  backgroundColor: getStatusColor(slot.status),
                  color: slot.status.toLowerCase() === "pending" ? "#333" : "#fff",
                }}
              >
                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </td>
              <td className="price">{slot.price ? `LKR ${slot.price}` : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityTable;
