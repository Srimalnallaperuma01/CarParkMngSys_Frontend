import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const VerifyOTP = () => {
  const { currentUser, verifyOtp, sendOtp } = useContext(UserContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if user is not logged in or already verified / admin
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "user" || currentUser.isVerified) {
      // Admins or verified users go to dashboard
      navigate(currentUser.role === "user" ? "/dashboard/book-slot" : "/admin");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(currentUser.email, otp);
      if (res.user || res.token) {
        alert("Verification successful!");
        navigate("/dashboard/book-slot");
      } else {
        alert(res.message || "OTP verification failed");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(currentUser.email);
      alert("OTP resent! Check your email or phone.");
    } catch (err) {
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify Your Account</h2>
      <p>We sent an OTP to your {currentUser?.otpMethod || "email"}. Please enter it below:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <button onClick={handleResend}>Resend OTP</button>
    </div>
  );
};

export default VerifyOTP;
