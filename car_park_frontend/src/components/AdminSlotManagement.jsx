import React, { useState } from "react";

const initialSlots = [
  { id: "A1", type: "Small", status: "available" },
  { id: "A2", type: "Medium", status: "booked" },
  { id: "B1", type: "Large", status: "available" }
];

const AdminSlotManagement = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [newSlot, setNewSlot] = useState({ id: "", type: "" });

  const addSlot = () => {
    if (!newSlot.id || !newSlot.type) return;
    setSlots([...slots, { ...newSlot, status: "available" }]);
    setNewSlot({ id: "", type: "" });
  };

  const toggleStatus = (id) => {
    setSlots(
      slots.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "available" ? "booked" : "available" }
          : s
      )
    );
  };

  const deleteSlot = (id) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  return (
    <div className="admin-slot-container">
      <h2>Manage Slots</h2>
      <div className="add-slot">
        <input
          placeholder="Slot ID"
          value={newSlot.id}
          onChange={(e) => setNewSlot({ ...newSlot, id: e.target.value })}
        />
        <input
          placeholder="Slot Type"
          value={newSlot.type}
          onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value })}
        />
        <button onClick={addSlot}>Add Slot</button>
      </div>

      <ul>
        {slots.map((slot) => (
          <li key={slot.id} style={{ margin: "10px 0" }}>
            {slot.id} ({slot.type}) - Status: {slot.status}
            <button onClick={() => toggleStatus(slot.id)} style={{ marginLeft: "10px" }}>
              Toggle Status
            </button>
            <button onClick={() => deleteSlot(slot.id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSlotManagement;
