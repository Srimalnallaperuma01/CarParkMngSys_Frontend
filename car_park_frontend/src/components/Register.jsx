import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    nic: "",
    vehicle: "",
    contact: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required/>
        <input name="nic" placeholder="NIC" onChange={handleChange} required/>
        <input name="vehicle" placeholder="Vehicle Details" onChange={handleChange} required/>
        <input name="contact" placeholder="Contact Info" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
