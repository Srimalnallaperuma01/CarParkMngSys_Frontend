import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Register.css";

const Register = () => {
  const { registerUser } = useContext(UserContext);
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
  const [showPassword, setShowPassword] = useState(false);

  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    vehicleNumber: /^([A-Z]{1,3}-\d{3,4}|\d{2,3}-\d{3,4})$/,
    phone: /^\+\d{10,15}$/,
    nic: /^(\d{9}[Vv]|\d{12})$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!patterns.email.test(value)) error = "Invalid email format";
        break;
      case "vehicleNumber":
        if (!patterns.vehicleNumber.test(value)) error = "Invalid vehicle number format";
        break;
      case "phone":
        if (value && !patterns.phone.test(value)) error = "Invalid phone number (+94XXXXXXXXX)";
        break;
      case "nic":
        if (!patterns.nic.test(value)) error = "NIC must be 123456789V or 200009401951";
        break;
      case "password":
        if (!patterns.password.test(value)) error = "Password must be 8+ chars with uppercase, lowercase, number & special char";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for any existing errors
    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) return alert("Please fix errors before submitting");

    setLoading(true);
    try {
      await registerUser(formData);
      alert("Registration successful! Please verify your account via OTP.");
      navigate("/verify-otp");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>Full Name</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <div className="password-wrapper">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <span className="error">{errors.password}</span>}

        <label>NIC</label>
        <input type="text" name="nic" value={formData.nic} onChange={handleChange} required />
        {errors.nic && <span className="error">{errors.nic}</span>}

        <label>Vehicle Number</label>
        <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
        {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}

        <label>Phone Number</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94XXXXXXXXX" />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label>OTP Method</label>
        <select name="otpMethod" value={formData.otpMethod} onChange={handleChange} required>
          <option value="email">Email OTP</option>
          <option value="phone">SMS OTP</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
