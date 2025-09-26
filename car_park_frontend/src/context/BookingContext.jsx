// src/context/BookingContext.jsx
import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => setBookings(prev => [...prev, booking]);

  const cancelBooking = (bookingId) => setBookings(prev => prev.filter(b => b._id !== bookingId));

  return (
    <BookingContext.Provider value={{ bookings, setBookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
