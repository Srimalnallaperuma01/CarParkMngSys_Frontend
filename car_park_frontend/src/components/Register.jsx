// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  const { sendOtp } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nic: "",
    vehicleNumber: "",
    phone: "",
    otpMethod: "email",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    vehicleNumber: /^([A-Z]{1,3}-\d{3,4}|\d{2,3}-\d{3,4})$/,
    phone: /^\+\d{10,15}$/,
    nic: /^(\d{9}[Vv]|\d{12})$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email": if (!patterns.email.test(value)) error = "Invalid email"; break;
      case "vehicleNumber": if (!patterns.vehicleNumber.test(value)) error = "Invalid vehicle number"; break;
      case "phone": if (value && !patterns.phone.test(value)) error = "Invalid phone number"; break;
      case "nic": if (!patterns.nic.test(value)) error = "Invalid NIC"; break;
      case "password": if (!patterns.password.test(value)) error = "Password too weak"; break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSendOtp = async () => {
    // basic client side required checks
    const required = ["username", "email", "password", "nic", "vehicleNumber"];
    for (const f of required) {
      if (!formData[f]) return alert(`Please fill ${f}`);
    }
    if (Object.values(errors).some(Boolean)) return alert("Fix errors first");

    setLoading(true);
    try {
      await sendOtp(formData);
      alert("OTP sent — check your email/phone");
      navigate("/verify-otp", { state: { formData } });
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={(e) => e.preventDefault()} className="register-form">
        <label>Full Name</label>
        <input name="username" value={formData.username} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} type="email" required />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <input name="password" value={formData.password} onChange={handleChange} type="password" required />
        {errors.password && <span className="error">{errors.password}</span>}

        <label>NIC</label>
        <input name="nic" value={formData.nic} onChange={handleChange} placeholder="123456789V  " required />
        {errors.nic && <span className="error">{errors.nic}</span>}

        <label>Vehicle Number</label>
        <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="ABC-1234" required />
        {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}

        <label>Phone (optional)</label>
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+941234567" />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label>OTP Method</label>
        <select name="otpMethod" value={formData.otpMethod} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="phone">SMS</option>
        </select>

        <button type="button" onClick={handleSendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP & Verify"}
        </button>

        <Link to="/" className="cancel-btn">Cancel</Link>
      </form>
    </div>
  );
};

export default Register;
