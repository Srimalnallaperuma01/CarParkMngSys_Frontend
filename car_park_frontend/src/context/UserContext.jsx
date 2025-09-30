// src/context/UserContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const API = "http://localhost:5000/api/auth";

  // Step 1: send OTP with full registration data
  const sendOtp = async (formData) => {
    try {
      const res = await axios.post(`${API}/send-otp`, formData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: verify OTP (backend will create user) — returns user + token
  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post(`${API}/verify-otp`, { email, otp });
      if (res.data.success) {
        const { user, token } = res.data;
        if (token) localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          setCurrentUser(user);
        }
        return res.data;
      } else {
        throw new Error(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "OTP verification failed");
    }
  };

  const resendOtp = async (email, otpMethod = "email") => {
    try {
      const res = await axios.post(`${API}/resend-otp`, { email, otpMethod });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  // login (bypasses OTP)
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      if (!res.data.success) throw new Error(res.data.message || "Login failed");
      const { user, token, role } = res.data;
      if (token) localStorage.setItem("token", token);
      if (user) {
        const fullUser = { ...user, role };
        localStorage.setItem("currentUser", JSON.stringify(fullUser));
        setCurrentUser(fullUser);
        return fullUser;
      }
      return null;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ currentUser, sendOtp, verifyOtp, resendOtp, loginUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
