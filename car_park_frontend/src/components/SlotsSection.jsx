import React, { useContext, useEffect } from "react";
import { SlotsContext } from "../context/SlotContext";
import "./SlotsSection.css";

const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case "available": return "#28a745";
    case "booked": return "#dc3545";
    case "pending": return "#ffc107";
    default: return "#ccc";
  }
}

const SlotsSection = () => {
  const { slotsData, fetchSlots } = useContext(SlotsContext);

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, []);

  return (
    <section className="slots-section">
      <h2>Available Slots</h2>
      <div className="slots-grid">
        {slotsData.length > 0 ? (
          slotsData.map(slot => (
            <div key={slot._id} className="slot-card" style={{ borderColor: getStatusColor(slot.status) }}>
              <h3>{slot.slotNumber}</h3>
              <p style={{ color: getStatusColor(slot.status) }}>
                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </p>
              <p>Price: {slot.price || "LKR 0"}</p>
            </div>
          ))
        ) : (
          <p>Loading slots...</p>
        )}
      </div>
    </section>
  );
};

export default SlotsSection;
