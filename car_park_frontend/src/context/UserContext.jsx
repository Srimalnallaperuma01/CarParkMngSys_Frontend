import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Safely parse localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Failed to parse localStorage user:", err);
      return null;
    }
  });

  const API_URL = "http://localhost:5000/api/auth";

  // Register
  const registerUser = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, formData);
      const user = res.data.user;

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (res.data.token) localStorage.setItem("token", res.data.token);

      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // Login
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });

      const user = res.data.user || {};  // fallback
      const token = res.data.token;
      const role = res.data.role;        // important: capture role

      if (!token || !role) throw new Error("Login failed: Invalid response");

      // Save everything
      const fullUser = { ...user, role }; // include role in user object
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(fullUser));
      setCurrentUser(fullUser);

      return fullUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
