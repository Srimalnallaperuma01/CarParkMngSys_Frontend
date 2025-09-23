import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"24px auto"}}>
        <h2 className="h1">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Login as Admin</button>
        </form>
      </div>
    </div>
  );
}
