// src/context/SlotsContext.jsx
import React, { createContext, useState } from "react";

export const SlotsContext = createContext();

export const SlotsProvider = ({ children }) => {
  // Initial slots with status and price
  const [slotsData, setSlotsData] = useState([
    { id: "A1", status: "available", price: 200 },
    { id: "A2", status: "booked", price: 200 },
    { id: "B1", status: "available", price: 250 },
    { id: "B2", status: "pending", price: 250 },
    { id: "C1", status: "available", price: 300 },
  ]);

  return (
    <SlotsContext.Provider value={{ slotsData, setSlotsData }}>
      {children}
    </SlotsContext.Provider>
  );
};
