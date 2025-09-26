// src/context/BookingContext.jsx
import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const cancelBooking = (qr, slotsData, setSlotsData) => {
    setBookings(prev => prev.filter(b => b.qr !== qr));
    setSlotsData(slotsData.map(slot =>
      slot.id === qr.split("|")[0].split(":")[1] ? { ...slot, status: "available" } : slot
    ));
  };

  return (
    <BookingContext.Provider value={{ bookings, setBookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
