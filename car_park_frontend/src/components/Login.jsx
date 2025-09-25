import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAdmin } from "../data/defaultAdmin";
import { UserContext } from "../context/UserContext";
import BackButton from "../components/BackButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();

    // Super Admin login
    if (email === defaultAdmin.email && password === defaultAdmin.password) {
      setCurrentUser(defaultAdmin);
      navigate("/admin");
      return;
    }

    // TODO: Normal customer/admin login via backend
    console.log("Normal login:", { email, password });
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <BackButton></BackButton>
      </form>
    </div>
  );
};

export default Login;
