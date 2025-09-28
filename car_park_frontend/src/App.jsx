import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import GuestBooking from "./components/GuestBooking";

import Dashboard from "./components/Dashboard";
import BookSlot from "./components/BookSlot";
import MyBookings from "./components/MyBookings";
import Payments from "./components/Payments";
import Notifications from "./components/Notifications";

import AdminDashboard from "./components/AdminDashboard";
import UsersAdminList from "./components/UsersAdminList";
import AdminSlotManagement from "./components/AdminSlotManagement";
import AdminBookings from "./components/AdminBookings";

export default function App() {
  const { currentUser } = useContext(UserContext);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/guest" element={<GuestBooking />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          currentUser?.role === "user" ? <Dashboard /> : <Navigate to="/login" />
        }
      >
        <Route path="book-slot" element={<BookSlot />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin/*"
        element={
          currentUser?.role === "admin" || currentUser?.role === "superadmin"
            ? <AdminDashboard />
            : <Navigate to="/login" />
        }
      >
        <Route path="users" element={<UsersAdminList />} />
        <Route path="slots" element={<AdminSlotManagement />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
