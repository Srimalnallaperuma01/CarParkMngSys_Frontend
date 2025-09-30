import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const API_URL = "http://localhost:5000/api/auth";

  // --- Register User ---
  const registerUser = async (formData) => {
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

  // --- Login User (no OTP check) ---
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const user = res.data.user;

      // Mark as verified for all existing users and admins
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
