import React from "react";

const Payments = () => {
  const payments = [
    { id: 1, status: "Pending" },
    { id: 2, status: "Confirmed" },
    { id: 3, status: "Pending" }
  ];

  const getColor = (status) => {
    if (status === "Pending") return "yellow";
    if (status === "Confirmed") return "green";
  };

  return (
    <div className="payments-container">
      <h2>Payments</h2>
      <ul>
        {payments.map((p) => (
          <li key={p.id} style={{ backgroundColor: getColor(p.status), padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
            Payment ID: {p.id} - Status: {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
