import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import pimg from "../images/pimg.jpg";
import bg from "../images/bg.jpg";
import { SlotsContext } from "../context/SlotContext"; // ✅ import SlotsContext

const getStatusColor = (status) => {
  if (!status) return "gray";
  status = status.toLowerCase();
  if (status === "available") return "green";
  if (status === "booked") return "red";
  if (status === "pending") return "orange";
};

const LandingPage = () => {
  const [showSlots, setShowSlots] = useState(false);
  const { slotsData, fetchSlots } = useContext(SlotsContext); // ✅ use slots context

  useEffect(() => {
    fetchSlots(); // fetch slots from backend on mount
  }, []);

  return (
    <div className="landing-container">
      
      <header className="landing-header">
        <ul className="headername">
          <li><h1 id="main1">Car Park Management System</h1></li>
          <li><h5 id="sub1">Easy Parking with QR Code</h5></li>
        </ul>
        <div className="auth-buttons">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </header>
      
      <img className="bgimg" src={bg} alt="Background" />

      <div className="homecontents">
        <section className="hero">
        <img src={pimg} alt="Car Parking Illustration" className="hero-img" />
        <h2>Easy Parking with QR Code</h2>
      </section>

      <section className="quick-info">
        <h3>Quick Info</h3>
        <ul className="home-list">
          <li></li>
          <li>Parking Fees: LKR 200–500 per hour depending on slot type</li>
          <li>Slot Status: Real-time availability with booking option</li>
          <li>Rules: Safe parking, valid vehicle ID required, no overnight parking without approval</li>
          <li>Payment: Upload payment slip and receive confirmation & QR code</li>
        </ul>
      </section>

      <section className="cta-buttons">
        <Link to="/login" className="btn">Book a Slot</Link>
        <button className="btn" onClick={() => setShowSlots(!showSlots)}>
          {showSlots ? "Hide Availability" : "Check Availability"}
        </button>
        <Link to="/guest" className="btn">Continue as Guest</Link>
      </section>
      </div>

      <div className="hometable">
      {showSlots && (
        <section style={{ marginTop: "20px" }}>
          <h3>Slot Availability</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Status</th>
                <th>Price (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {slotsData.length > 0 ? (
                slotsData.map((slot) => (
                  <tr key={slot._id}>
                    <td>{slot.slotNumber}</td>
                    <td style={{
                      backgroundColor: getStatusColor(slot.status),
                      color: slot.status === "pending" ? "black" : "white",
                      textAlign: "center"
                    }}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </td>
                    <td>{slot.price || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{ textAlign: "center" }}>Loading slots...</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
      </div>
    </div>
  );
};

export default LandingPage;
