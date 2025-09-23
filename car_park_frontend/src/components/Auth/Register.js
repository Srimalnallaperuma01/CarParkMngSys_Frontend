import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nic, setNic] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username: name,  // matches backend
        email,
        password,
        nic,
        vehicleNumber
      });
      alert("Registration successful!");
      if (res.data.token) localStorage.setItem("token", res.data.token);

      setName(""); setEmail(""); setPassword(""); setNic(""); setVehicleNumber("");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input placeholder="NIC" value={nic} onChange={e => setNic(e.target.value)} required />
      <input placeholder="Vehicle Number" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}
