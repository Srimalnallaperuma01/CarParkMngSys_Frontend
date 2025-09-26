import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Login (users -> /auth/login, admins -> /admin/login)
  const loginUser = async (email, password) => {
    try {
      // First try admin login
      let res;
      try {
        res = await axios.post(`${API_URL}/admin/login`, { email, password });
      } catch {
        // If not admin, fallback to user login
        res = await axios.post(`${API_URL}/auth/login`, { email, password });
      }

      const data = res.data;
      const userData = data.user || data.admin; // backend may return user or admin

      const userObj = {
        id: userData._id || userData.id,
        name: userData.name || userData.username,
        email: userData.email,
        role: userData.role || "user",
        token: data.token,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("token", data.token);

      setCurrentUser(userObj);
      return userObj;
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  // ✅ Register (for normal users)
  const registerUser = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data?.message || err.message);
      throw err.response?.data?.message || err.message;
    }
  };

  // ✅ Logout
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // ✅ Load user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loginUser, registerUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
