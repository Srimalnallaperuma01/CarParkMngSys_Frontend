import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

// Public Pages
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import GuestBooking from "./components/GuestBooking";
import About from "./components/AboutUs";
import Privacy from "./components/PrivacyPolicy";
import Contact from "./components/ContactUs";
import VerifyOtp from "./components/VerifyOtp";

// User Dashboard Pages
import Dashboard from "./components/Dashboard";
import BookSlot from "./components/BookSlot";
import MyBookings from "./components/MyBookings";
import Payments from "./components/Payments";
import Notifications from "./components/Notifications";

// Admin Dashboard Pages
import AdminDashboard from "./components/AdminDashboard";
import UsersAdminList from "./components/UsersAdminList";
import AdminSlotManagement from "./components/AdminSlotManagement";
import AdminBookings from "./components/AdminBookings";

export default function App() {
  const { currentUser } = useContext(UserContext);

  // Only redirect unverified users
  const requireUserVerification = (element) => {
    if (!currentUser) return <Navigate to="/login" />;
    // Only enforce OTP for "user" role
    if (currentUser.role === "user" && !currentUser.isVerified) return <Navigate to="/verify-otp" />;
    return element;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/guest" element={<GuestBooking />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          currentUser?.role === "user"
            ? requireUserVerification(<Dashboard />)
            : <Navigate to="/login" />
        }
      >
        <Route path="book-slot" element={<BookSlot />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin Dashboard (no OTP check) */}
      <Route
        path="/admin/*"
        element={
          currentUser && (currentUser.role === "admin" || currentUser.role === "superadmin")
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
