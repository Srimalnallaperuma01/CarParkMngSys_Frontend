import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

import "./components/App.css";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import GuestBooking from "./components/GuestBooking";
import EntryExitGate from "./components/EntryExitGate";
import CheckAvailability from "./components/CheckAvailability";

import Dashboard from "./components/Dashboard";
import BookSlot from "./components/BookSlot";
import MyBookings from "./components/MyBookings";
import Payments from "./components/Payments";
import Notifications from "./components/Notifications";

import AdminDashboard from "./components/AdminDashboard";
import AdminSlotManagement from "./components/AdminSlotManagement";
import AdminBookings from "./components/AdminBookings";

function AppRoutes() {
  const { currentUser } = useContext(UserContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/guest" element={<GuestBooking />} />
      <Route path="/gate" element={<EntryExitGate />} />
      <Route path="/slots" element={<CheckAvailability />} />

      {/* Customer Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          currentUser && currentUser.role === "user" ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
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
          currentUser &&
          (currentUser.role === "admin" || currentUser.role === "superadmin") ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="users" element={<div>Manage Users</div>} />
        <Route path="slots" element={<AdminSlotManagement />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<div>Approve Payments</div>} />
        <Route path="reports" element={<div>Reports</div>} />
        <Route path="analytics" element={<div>Analytics</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
