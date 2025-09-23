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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      // optionally save user summary
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"24px auto"}}>
        <h2 className="h1">User Login</h2>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
