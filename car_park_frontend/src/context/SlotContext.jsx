import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export const SlotsContext = createContext();

export const SlotsProvider = ({ children }) => {
  const [slotsData, setSlotsData] = useState([]);

  const normalizeStatus = (status) => {
    if (!status) return "available";
    const s = status.toLowerCase();
    if (s === "available") return "available";   // green
    if (s === "pending") return "pending";       // orange
    if (s === "approved" || s === "booked") return "booked"; // red
    return "available";
  };

  const fetchSlots = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) {
        const mappedSlots = res.data.map((s) => ({
          _id: s._id,
          slotNumber: s.slotNumber,
          status: normalizeStatus(s.status),
          price: s.price || 0,
        }));
        setSlotsData(mappedSlots);
      }
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  }, []);

  useEffect(() => {
    fetchSlots(); // initial fetch
    const interval = setInterval(fetchSlots, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [fetchSlots]);

  return (
    <SlotsContext.Provider value={{ slotsData, setSlotsData, fetchSlots }}>
      {children}
    </SlotsContext.Provider>
  );
};
