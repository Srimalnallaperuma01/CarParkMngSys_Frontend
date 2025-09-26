import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ id: "", type: "" });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/slots`);
      setSlots(res.data);
    } catch (err) {
      alert("Failed to fetch slots: " + err.message);
    }
  };

  const addSlot = async () => {
    if (!newSlot.id || !newSlot.type) return alert("Enter slot ID and type!");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/slots`, { ...newSlot, status: "available" });
      setNewSlot({ id: "", type: "" });
      fetchSlots();
    } catch (err) {
      alert("Failed to add slot: " + err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "available" ? "booked" : "available";
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/slots/${id}`, { status: nextStatus });
      fetchSlots();
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  const deleteSlot = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/slots/${id}`);
      fetchSlots();
    } catch (err) {
      alert("Failed to delete slot: " + err.message);
    }
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
            <button onClick={() => toggleStatus(slot.id, slot.status)} style={{ marginLeft: "10px" }}>
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
