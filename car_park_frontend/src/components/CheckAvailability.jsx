import React from "react";

const slots = [
  { id: "A1", status: "available", price: 200 },
  { id: "A2", status: "booked", price: 200 },
  { id: "B1", status: "available", price: 250 },
  { id: "B2", status: "pending", price: 250 },
  { id: "C1", status: "available", price: 300 },
];

const getStatusColor = (status) => {
  if (status === "available") return "green";
  if (status === "booked") return "red";
  if (status === "pending") return "yellow";
};

const CheckAvailability = () => {
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
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.id}</td>
              <td style={{ backgroundColor: getStatusColor(slot.status), color: slot.status === "pending" ? "black" : "white", textAlign: "center" }}>
                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </td>
              <td>{slot.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckAvailability;
