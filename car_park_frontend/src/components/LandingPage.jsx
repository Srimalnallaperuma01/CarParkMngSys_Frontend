import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import pimg from "../images/pimg.jpg"

const slots = [
  { id: "A1", status: "available", price: 200 },
  { id: "A2", status: "booked", price: 200 },
  { id: "B1", status: "available", price: 250 },
  { id: "B2", status: "pending", price: 250 },
  { id: "C1", status: "available", price: 300 },
];

const getStatusColor = (status) => {
  if (status === "available") return "green";
  if (status === "booked") return "red";
  if (status === "pending") return "yellow";
};

const LandingPage = () => {
  const [showSlots, setShowSlots] = useState(false);

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

      <section className="hero">
        <img
          src={pimg}
          alt="Car Parking Illustration"
          className="hero-img"
        />
        <h2>Easy Parking with QR Code</h2>
      </section>

      <section className="quick-info">
        <h3>Quick Info</h3>
        <ul className="home-list">
          <li>Parking Rates: $2/hour</li>
          <li>Rules & Availability: View-only</li>
        </ul>
      </section>

      <section className="cta-buttons">
        <Link to="/login" className="btn">Book a Slot</Link>
        <button className="btn" onClick={() => setShowSlots(!showSlots)}>
          {showSlots ? "Hide Availability" : "Check Availability"}
        </button>
        <Link to="/guest" className="btn">Continue as Guest</Link>
      </section>

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
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td>{slot.id}</td>
                  <td style={{
                    backgroundColor: getStatusColor(slot.status),
                    color: slot.status === "pending" ? "black" : "white",
                    textAlign: "center"
                  }}>
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </td>
                  <td>{slot.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
