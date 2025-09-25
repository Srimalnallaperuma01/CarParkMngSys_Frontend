import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "./BackButton";

const BookSlot = () => {
  const { slotsData, setSlotsData } = useOutletContext(); // ✅ get slotsData from Outlet
  const { addBooking } = useContext(BookingContext);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [qrValue, setQrValue] = useState("");

  const availableSlots = slotsData.filter(slot => slot.status === "available");

  const handleBooking = () => {
    if (!selectedSlot || !date || !time) {
      alert("Please select slot, date, and time.");
      return;
    }

    const qr = `Slot:${selectedSlot}|Date:${date}|Time:${time}|ID:${Math.floor(Math.random() * 100000)}`;
    setQrValue(qr);

    const newSlots = slotsData.map(slot =>
      slot.id === selectedSlot ? { ...slot, status: "booked" } : slot
    );
    setSlotsData(newSlots);

    addBooking({ slot: selectedSlot, date, time, qr });
  };

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${selectedSlot}.png`;
    a.click();
  };

  const getSlotColor = (status) => {
    if (status === "available") return "#4caf50";
    if (status === "booked") return "#f44336";
    if (status === "pending") return "#ff9800";
  };

  return (
    <div className="bookslot-container">
      <BackButton />
      <h2>Book a Slot</h2>

      <div className="slots-grid">
        {availableSlots.length === 0 ? (
          <p>No available slots.</p>
        ) : (
          availableSlots.map(slot => (
            <div
              key={slot.id}
              className={`slot-card ${selectedSlot === slot.id ? "selected" : ""}`}
              style={{ backgroundColor: getSlotColor(slot.status) }}
              onClick={() => setSelectedSlot(slot.id)}
            >
              {slot.id} {selectedSlot === slot.id && "(Selected)"}
            </div>
          ))
        )}
      </div>

      <div className="datetime-inputs">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      </div>

      <button className="book-btn" onClick={handleBooking}>Book & Generate QR</button>

      {qrValue && (
        <div className="qr-section">
          <h3>Your QR Code:</h3>
          <QRCodeCanvas value={qrValue} size={128} />
          <button className="download-btn" onClick={downloadQR}>Download QR</button>
        </div>
      )}
    </div>
  );
};

export default BookSlot;
