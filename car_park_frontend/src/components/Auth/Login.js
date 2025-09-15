import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST login request
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password
      });

      // Save token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("Login successful!");
      navigate("/dashboard"); // redirect user

    } catch (err) {
      // Handle backend error
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Login failed: " + err.message);
      }
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
