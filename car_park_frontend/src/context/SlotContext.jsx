// src/context/SlotsContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const SlotsContext = createContext();

export const SlotsProvider = ({ children }) => {
  const [slotsData, setSlotsData] = useState([]);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      setSlotsData(res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <SlotsContext.Provider value={{ slotsData, setSlotsData, fetchSlots }}>
      {children}
    </SlotsContext.Provider>
  );
};
