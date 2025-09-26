import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "available": return "green";
    case "booked": return "red";
    case "pending": return "yellow";
    default: return "grey";
  }
};

const CheckAvailability = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      // Fetch from backend
      const res = await axiosInstance.get("/parking"); // make sure this matches your backend route
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  useEffect(() => {
    fetchSlots(); // initial fetch

    // Poll every 3 seconds
    const interval = setInterval(() => {
      fetchSlots();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading slots...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Check Slot Availability</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Slot ID</th>
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
                  color: slot.status.toLowerCase() === "pending" ? "black" : "white",
                  textAlign: "center",
                }}
              >
                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </td>
              <td>{slot.price || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckAvailability;
