// src/api/axiosInstance.js
import axios from "axios";

// Create axios instance
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
  timeout: 5000, // optional
});

// Add a request interceptor to include JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get JWT token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle global errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Token may be invalid or expired.");
    } else if (error.response?.status === 403) {
      console.error("Forbidden! Admin access required.");
    }
    return Promise.reject(error);
  }
);

export default instance;
