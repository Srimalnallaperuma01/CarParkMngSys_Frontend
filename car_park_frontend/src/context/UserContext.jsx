import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const loginUser = async (email, password) => {
  try {
    let res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    let user = res.data.user;
    // Remove this line:
    // user.role = "user";

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  } catch (errUser) {
    throw new Error("Login failed: Invalid credentials");
  }
};


  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <UserContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
