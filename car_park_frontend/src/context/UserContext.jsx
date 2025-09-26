// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

export const UserContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // login tries admin first then user (keeps compatibility)
  const loginUser = async (email, password) => {
    try {
      // try admin login endpoint first
      try {
        const res = await axiosInstance.post("/admin/login", { email, password });
        const admin = res.data.admin;
        const token = res.data.token;
        const userObj = { id: admin.id, name: admin.name, email: admin.email, role: admin.role, token };
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("token", token);
        setCurrentUser(userObj);
        return userObj;
      } catch (errAdmin) {
        // fallback to auth login
        const res = await axiosInstance.post("/auth/login", { email, password });
        const token = res.data.token;
        const user = res.data.user;
        const userObj = { id: user.id, name: user.name, email: user.email, role: user.role, token };
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("token", token);
        setCurrentUser(userObj);
        return userObj;
      }
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await axiosInstance.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data?.message || err.message);
      throw err.response?.data?.message || err.message;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (saved && token) {
      setCurrentUser(JSON.parse(saved));
      // axiosInstance interceptor already reads token from localStorage
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loginUser, registerUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
