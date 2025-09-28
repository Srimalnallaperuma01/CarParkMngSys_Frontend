import React, { useState, useEffect, useContext, useRef } from "react"; 
import { Link } from "react-router-dom";
import "./LandingPage.css";
import pimg from "../images/pimg.jpg";
import bg1 from "../images/bg1.jpg";
import { SlotsContext } from "../context/SlotContext";

const getStatusColor = (status) => {
  if (!status) return "gray";
  status = status.toLowerCase();
  if (status === "available") return "#28a745";
  if (status === "booked") return "#dc3545";
  if (status === "pending") return "#ffc107";
};

const LandingPage = () => {
  const [showSlots, setShowSlots] = useState(false);
  const { slotsData, fetchSlots } = useContext(SlotsContext);
  const slotsRef = useRef(null); // ref for slots section

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCheckAvailability = () => {
    const newShow = !showSlots;
    setShowSlots(newShow);

    // Scroll to table when showing it
    if (!showSlots) {
      setTimeout(() => {
        slotsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="landing-container">

      {/* Header */}
      <header className="landing-header">
        <div className="header-left">
          <h1>Car Park Management System</h1>
          <h5>Easy Parking with QR Code</h5>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img src={bg1} alt="Background" className="bg-img" />

        <div className="hero-overlay">
          <div className="hero-content">

            <div className="quick-info-section">
              <h3>Quick Info</h3>
              <ul>
                <li>Parking Fees: LKR 200–500 per hour depending on slot type</li>
                <li>Slot Status: Real-time availability with booking option</li>
                <li>Rules: Safe parking, valid vehicle ID required, no overnight parking without approval</li>
                <li>Payment: Upload payment slip and receive confirmation & QR code</li>
              </ul>
              
              <div className="cta-buttons">
                <Link to="/login" className="btn btn-light-blue">Book a Slot</Link>
                <button className="btn" onClick={handleCheckAvailability}>
                  {showSlots ? "Hide Availability" : "Check Availability"}
                </button>
                <Link to="/guest" className="btn btn-light-blue">Continue as Guest</Link>
              </div>

            </div>

            <div className="hero-image-section">
              <img src={pimg} alt="Car Parking Illustration" className="hero-img" />
              <h2>Easy Parking with QR Code</h2>
            </div>

          </div>
        </div>
      </section>

      {/* Slot Table */}
      {showSlots && (
        <section className="slots-table" ref={slotsRef}>
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
                  <tr key={slot._id} className="slot-row">
                    <td>{slot.slotNumber}</td>
                    <td style={{
                      backgroundColor: getStatusColor(slot.status),
                      color: slot.status === "pending" ? "black" : "white",
                      textAlign: "center",
                      borderRadius: "6px",
                      padding: "5px 0"
                    }}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </td>
                    <td>{slot.price || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>Loading slots...</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
