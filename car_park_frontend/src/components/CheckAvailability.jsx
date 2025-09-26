import React, { useContext } from "react";
import { SlotsContext } from "../context/SlotContext";

const getStatusColor = (status) => {
  if (status === "available") return "green";
  if (status === "booked") return "red";
  if (status === "pending") return "yellow";
};

const CheckAvailability = () => {
  const { slotsData } = useContext(SlotsContext); // ✅ get slots from context

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
            <tr key={slot.id}>
              <td>{slot.id}</td>
              <td
                style={{
                  backgroundColor: getStatusColor(slot.status),
                  color: slot.status === "pending" ? "black" : "white",
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
