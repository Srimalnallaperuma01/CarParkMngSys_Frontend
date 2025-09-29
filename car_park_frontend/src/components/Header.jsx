import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ scrollToSlots }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">Parkly</div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <Link to="/about">About Us</Link>
        <Link to="/privacy">Privacy & Policy</Link>
        <Link to="/contact">Contact Us</Link>
        <button className="btn-flat btn-white" onClick={scrollToSlots}>Check Availability</button>
        <Link to="/book" className="btn-flat btn-blue">Book a Slot</Link>
      </nav>
    </header>
  );
};

export default Header;
