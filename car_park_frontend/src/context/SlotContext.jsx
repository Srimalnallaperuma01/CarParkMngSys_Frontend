import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export const SlotsContext = createContext();

export const SlotsProvider = ({ children }) => {
  const [slotsData, setSlotsData] = useState([]);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) {
        // Normalize slot data
        const mappedSlots = res.data.map((s) => ({
          slotNumber: s.slotNumber,
          status: s.status.toLowerCase(),
          price: s.price || 0,
          _id: s._id,
        }));
        setSlotsData(mappedSlots);
      }
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  }, []);

  useEffect(() => {
    fetchSlots(); // initial fetch

    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, [fetchSlots]);

  return (
    <SlotsContext.Provider value={{ slotsData, setSlotsData, fetchSlots }}>
      {children}
    </SlotsContext.Provider>
  );
};
