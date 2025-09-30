import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const API_URL = "http://localhost:5000/api/auth";

  // --- Validation functions ---
  const validateRegistration = ({ email, vehicleNumber, phone, nic, password }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const vehicleRegex = /^([A-Z]{1,3}-\d{4}|\d{2,3}-\d{4})$/;
    const phoneRegex = /^\+\d{10,15}$/;
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(email)) return "Invalid email format";
    if (!vehicleRegex.test(vehicleNumber)) return "Invalid vehicle number format";
    if (phone && !phoneRegex.test(phone)) return "Invalid phone number format";
    if (!nicRegex.test(nic)) return "Invalid NIC format";
    if (!passwordRegex.test(password))
      return "Password must be at least 8 chars, include uppercase, lowercase, number, special char";

    return null;
  };

  // --- Register User ---
  const registerUser = async (formData) => {
    const validationError = validateRegistration(formData);
    if (validationError) throw new Error(validationError);

    try {
      await axios.post(`${API_URL}/register`, formData);

      const user = {
        email: formData.email,
        username: formData.username,
        role: "user",
        isVerified: false,
        otpMethod: formData.otpMethod || "email",
      };
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Send OTP
      await sendOtp(user.email);

      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // --- Login User (no OTP) ---
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const user = res.data.user;

      // Mark as verified for all users/admins
      const updatedUser = { ...user, isVerified: true };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const sendOtp = async (email) => {
    try {
      await axios.post(`${API_URL}/resend-otp`, { email });
    } catch (err) {
      console.error("Send OTP failed:", err);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      if (res.data.user || res.data.token) {
        const updatedUser = { ...currentUser, isVerified: true };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        sendOtp,
        verifyOtp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
