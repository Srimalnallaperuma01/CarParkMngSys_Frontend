import React, { useState } from "react";

const EntryExitGate = () => {
  const [qrInput, setQrInput] = useState("");
  const [message, setMessage] = useState("");

  const handleScan = () => {
    if (!qrInput) return;
    // Simple validation demo
    if (qrInput.includes("ID")) {
      setMessage(`QR valid! Entry/Exit recorded for: ${qrInput}`);
    } else {
      setMessage("Invalid QR Code");
    }
  };

  const handleGuestNIC = (e) => {
    e.preventDefault();
    if (!qrInput) return;
    setMessage(`Guest slot allocated for NIC: ${qrInput}`);
  };

  return (
    <div className="gate-container">
      <h2>Entry/Exit Gate</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Scan QR Code</h3>
        <input
          placeholder="Paste QR value"
          value={qrInput}
          onChange={(e) => setQrInput(e.target.value)}
        />
        <button onClick={handleScan}>Scan</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>On-Arrival Guest Entry</h3>
        <form onSubmit={handleGuestNIC}>
          <input
            placeholder="Enter NIC"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            required
          />
          <button type="submit">Allocate Slot</button>
        </form>
      </div>

      {message && (
        <div style={{ marginTop: "20px", backgroundColor: "#014E9E", color: "white", padding: "10px", borderRadius: "5px" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EntryExitGate;
