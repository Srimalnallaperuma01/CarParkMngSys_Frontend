// src/context/BookingContext.jsx
import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings(prev => [...prev, booking]);
  };

  return (
    <BookingContext.Provider value={{ bookings, setBookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
