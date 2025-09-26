// src/components/AdminSlotManagement.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AdminSlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ slotNumber: "", price: 100 });

  useEffect(() => { fetchSlots(); }, []);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      setSlots(res.data);
    } catch (err) {
      alert("Failed to fetch slots: " + err.message);
    }
  };

  const addSlot = async () => {
    if (!newSlot.slotNumber) return alert("Enter slot ID!");
    try {
      await axiosInstance.post("/parking", { slotNumber: newSlot.slotNumber, price: newSlot.price, location: "AdminAdded" });
      setNewSlot({ slotNumber: "", price: 100 });
      fetchSlots();
    } catch (err) {
      alert("Failed to add slot: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/parking/${id}`, { status: currentStatus === "Available" ? "Booked" : "Available" });
      fetchSlots();
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  const deleteSlot = async (id) => {
    try {
      await axiosInstance.delete(`/parking/${id}`);
      fetchSlots();
    } catch (err) {
      alert("Failed to delete slot: " + err.message);
    }
  };

  return (
    <div className="admin-slot-container">
      <h2>Manage Slots</h2>
      <div className="add-slot">
        <input placeholder="Slot Number (P1)" value={newSlot.slotNumber} onChange={(e) => setNewSlot({...newSlot, slotNumber: e.target.value })} />
        <input placeholder="Price" value={newSlot.price} onChange={(e) => setNewSlot({...newSlot, price: Number(e.target.value) })} />
        <button onClick={addSlot}>Add Slot</button>
      </div>

      <ul>
        {slots.map((slot) => (
          <li key={slot._id} style={{ margin: "10px 0" }}>
            {slot.slotNumber} - {slot.status} - {slot.price}
            <button onClick={() => toggleStatus(slot._id, slot.status)} style={{ marginLeft: "10px" }}>Toggle Status</button>
            <button onClick={() => deleteSlot(slot._id)} style={{ marginLeft: "10px" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSlotManagement;
