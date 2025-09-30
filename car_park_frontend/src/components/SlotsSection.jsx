import React, { useContext, useEffect, useState } from "react";
import { SlotsContext } from "../context/SlotContext";
import "./SlotsSection.css";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "#28a745"; // green
    case "booked":
      return "#dc3545"; // red
    case "pending":
      return "#ffc107"; // yellow
    default:
      return "#ccc"; // gray
  }
};

const SlotsSection = () => {
  const { slotsData, fetchSlots } = useContext(SlotsContext);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, []);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot.slotNumber);
  };

  return (
    <section className="slots-section">
      <h2>Parking Slots</h2>
      <div className="slots-grid">
        {slotsData.length > 0 ? (
          slotsData.map((slot) => {
            const isSelected = selectedSlot === slot.slotNumber;
            return (
              <div
                key={slot._id || slot.id}
                className={`slot-card ${isSelected ? "selected" : ""}`}
                style={{
                  borderColor: getStatusColor(slot.status),
                  backgroundColor: isSelected ? "#e0f7fa" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => handleSlotClick(slot)}
              >
                <h3>{slot.slotNumber}</h3>
                <p style={{ color: getStatusColor(slot.status) }}>
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </p>
                <p>Price: {slot.price || "LKR 0"}</p>
              </div>
            );
          })
        ) : (
          <p>Loading slots...</p>
        )}
      </div>
    </section>
  );
};

export default SlotsSection;
