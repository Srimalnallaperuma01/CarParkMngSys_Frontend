import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [nic,setNic]=useState("");
  const [vehicleNumber,setVehicleNumber]=useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // backend expects username
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username: name, email, password, nic, vehicleNumber
      });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || { username:name, email }));
      alert("Registered successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"24px auto"}}>
        <h2 className="h1">Register</h2>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <input required placeholder="NIC" value={nic} onChange={e=>setNic(e.target.value)} />
          <input required placeholder="Vehicle Number" value={vehicleNumber} onChange={e=>setVehicleNumber(e.target.value)} />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
