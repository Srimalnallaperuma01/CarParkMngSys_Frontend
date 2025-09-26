import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "./BackButton";

const GuestBooking = () => {
  const [nic, setNic] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [tempQR, setTempQR] = useState("");

  const handleGuestBooking = (e) => {
    e.preventDefault();
    if (!nic || !vehicle) return;
    const qr = `Guest|NIC:${nic}|Vehicle:${vehicle}|ID:${Math.floor(Math.random() * 100000)}`;
    setTempQR(qr);
  };

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `GuestQR_${nic}.png`;
    a.click();
  };

  return (
    <div className="guest-container">
      <h2>Guest Booking</h2>
      <form onSubmit={handleGuestBooking} className="guest-form">
        <input placeholder="NIC" value={nic} onChange={e => setNic(e.target.value)} required />
        <input placeholder="Vehicle Number" value={vehicle} onChange={e => setVehicle(e.target.value)} required />
        <button type="submit" className="book-btn">Book as Guest</button>
        <BackButton />
      </form>

      {tempQR && (
        <div className="qr-section">
          <h3>Temporary QR Code:</h3>
          <QRCodeCanvas value={tempQR} size={128} />
          <p>QR valid for one-time entry.</p>
          <button className="download-btn" onClick={downloadQR}>Download QR</button>
        </div>
      )}
    </div>
  );
};

export default GuestBooking;
