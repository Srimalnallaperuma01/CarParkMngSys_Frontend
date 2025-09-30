// src/components/VerifyOtp.jsx
import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./VerifyOtp.css";

const VerifyOTP = () => {
  const { verifyOtp, resendOtp } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const formData = location.state?.formData;
  useEffect(() => {
    if (!formData?.email) navigate("/register");
  }, [formData, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Enter OTP");

    setLoading(true);
    try {
      const res = await verifyOtp(formData.email, otp);
      alert("Registration complete");
      navigate("/dashboard/book-slot"); // or /login depending on your flow
    } catch (err) {
      alert(err.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOtp(formData.email, formData.otpMethod);
      alert("OTP resent");
    } catch (err) {
      alert(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify Your Account</h2>
      <p>OTP sent to your {formData?.otpMethod || "email"}. Enter it:</p>
      <form onSubmit={handleVerify}>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
        <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
      </form>
      <button onClick={handleResend} disabled={loading}>Resend OTP</button>
    </div>
  );
};

export default VerifyOTP;
