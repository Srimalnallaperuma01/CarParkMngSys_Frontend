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
        name,
        email,
        password,
        nic,
        vehicleNumber
      });

      alert("Registration successful!");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Clear form
      setName(""); setEmail(""); setPassword(""); setNic(""); setVehicleNumber("");

    } catch (err) {
      // Show exact backend message if exists
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Error registering: " + err.message);
      }
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="NIC" value={nic} onChange={e => setNic(e.target.value)} />
      <input placeholder="Vehicle Number" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
