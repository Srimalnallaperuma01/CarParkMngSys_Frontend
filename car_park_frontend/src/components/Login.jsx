import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await loginUser(email, password);

      // No OTP check needed here
      if (userData.role === "admin" || userData.role === "superadmin") navigate("/admin");
      else if (userData.role === "user") navigate("/dashboard/book-slot");
      else alert("Login failed: Unknown role");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div><button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <Link to="/" className="cancel-btn">Cancel</Link></div>
      </form>
    </div>
  );
};

export default Login;
