import React, { useState, useContext } from "react";
import { SlotsContext } from "../context/SlotContext";
import { BookingContext } from "../context/BookingContext";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "./BackButton";

const BookSlot = () => {
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const { addBooking } = useContext(BookingContext);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [qrValue, setQrValue] = useState("");

  const availableSlots = slotsData.filter(slot => slot.status === "available");

  const handleBooking = () => {
    if (!selectedSlot || !date || !time) {
      alert("Select slot, date, and time.");
      return;
    }

    const qr = `Slot:${selectedSlot}|Date:${date}|Time:${time}|ID:${Math.floor(Math.random()*100000)}`;
    setQrValue(qr);

    setSlotsData(slotsData.map(slot =>
      slot.id === selectedSlot ? { ...slot, status: "booked" } : slot
    ));

    addBooking({ slot: selectedSlot, date, time, qr });
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
              style={{ backgroundColor: slot.status === "available" ? "green" : "red" }}
              onClick={() => setSelectedSlot(slot.id)}
            >
              {slot.id} {selectedSlot === slot.id && "(Selected)"}
            </div>
          ))
        )}
      </div>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      <button onClick={handleBooking}>Book & Generate QR</button>

      {qrValue && <QRCodeCanvas value={qrValue} size={128} />}
    </div>
  );
};

export default BookSlot;
