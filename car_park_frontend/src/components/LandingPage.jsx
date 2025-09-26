import React, { useState, useEffect, useContext } from "react"; 
import { Link } from "react-router-dom";
import "./LandingPage.css";
import pimg from "../images/pimg.jpg";
import bg1 from "../images/bg1.jpg";
import { SlotsContext } from "../context/SlotContext";

const getStatusColor = (status) => {
  if (!status) return "gray";
  status = status.toLowerCase();
  if (status === "available") return "green";
  if (status === "booked") return "red";
  if (status === "pending") return "orange";
};

const LandingPage = () => {
  const [showSlots, setShowSlots] = useState(false);
  const { slotsData, fetchSlots } = useContext(SlotsContext);

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="landing-container">

      {/* Header */}
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

      {/* Background Image */}
      <div className="homeimg-container">
        <img className="bgimg" src={bg1} alt="Background" />

        {/* Overlay content on bgimg */}
        <div className="homecontents1">
          
          

          {/* Quick Info & CTA Buttons */}
          <div className="homebtns">
            <section className="quick-info">
              <ul className="home-list">
                <h3>Quick Info</h3>
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

          {/* Hero Image */}
          <div className="homeimg">
            <section className="hero">
              <img src={pimg} alt="Car Parking Illustration" className="hero-img" />
              <h2>Easy Parking with QR Code</h2>
            </section>
          </div>

        </div>
      </div>

      {/* Slot Table */}
      <div className="hometable">
        {showSlots && (
          <section style={{ marginTop: "20px" }}>
            <h3>Slot Availability</h3>
            <table>
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
