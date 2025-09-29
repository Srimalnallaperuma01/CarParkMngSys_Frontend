import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // --- Register User ---
  const registerUser = async (formData) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);

      const user = res.data.user;
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // --- Login User ---
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const user = res.data.user;
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      return user;
    } catch (errUser) {
      throw new Error("Login failed: Invalid credentials");
    }
  };

  // --- Logout User ---
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <UserContext.Provider value={{ currentUser, registerUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
