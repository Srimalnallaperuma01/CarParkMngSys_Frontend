import React, { useRef, useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { SlotsContext } from "../context/SlotContext";
import "./LandingPage.css";
import heroImg from "../images/hero.jpg";
import ScrollTopButton from "./ScrollTopButton";

const LandingPage = () => {
  const aboutRef = useRef(null);
  const privacyRef = useRef(null);
  const contactRef = useRef(null);
  const slotsRef = useRef(null);
  const bookRef = useRef(null);
  const heroRef = useRef(null);

  const [activeSection, setActiveSection] = useState("");
  const { slotsData, setSlotsData } = useContext(SlotsContext);
  const [loading, setLoading] = useState(true);

  // Scroll handling
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const sections = [
      { id: "hero", ref: heroRef },
      { id: "about", ref: aboutRef },
      { id: "privacy", ref: privacyRef },
      { id: "contact", ref: contactRef },
      { id: "slots", ref: slotsRef },
      { id: "book", ref: bookRef },
    ];
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    sections.forEach((section) => {
      if (
        section.ref.current.offsetTop <= scrollPosition &&
        section.ref.current.offsetTop + section.ref.current.offsetHeight > scrollPosition
      ) {
        setActiveSection(section.id);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch slots from backend
  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("/parking");
      if (res.data) setSlotsData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available": return "#28a745";
      case "booked": return "#dc3545";
      case "pending": return "#FFC107";
      default: return "#6c757d";
    }
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Parkly</div>
        <nav className="nav">
          <button
            className={`nav-btn ${activeSection === "about" ? "active" : ""}`}
            onClick={() => scrollToSection(aboutRef)}
          >
            About
          </button>
          <button
            className={`nav-btn ${activeSection === "privacy" ? "active" : ""}`}
            onClick={() => scrollToSection(privacyRef)}
          >
            Privacy
          </button>
          <button
            className={`nav-btn ${activeSection === "contact" ? "active" : ""}`}
            onClick={() => scrollToSection(contactRef)}
          >
            Contact
          </button>
          <button
            className={`nav-btn ${activeSection === "slots" ? "active" : ""}`}
            onClick={() => scrollToSection(slotsRef)}
          >
            Availability
          </button>
          <button
            className={`nav-btn ${activeSection === "book" ? "active" : ""}`}
            onClick={() => scrollToSection(bookRef)}
          >
            Book
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="section hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="animate-slide-left">Welcome to Parkly</h1>
            <p className="animate-fade-in">
              Effortless parking with real-time availability, QR code verification, and online booking.
            </p>
            <div className="hero-buttons">
              <a href="/login" className="btn-flat btn-blue animate-pop">Login</a>
              <a href="/register" className="btn-flat btn-yellow animate-pop">Register</a>
              <button
                className="btn-flat btn-light-blue animate-pop"
                onClick={() => scrollToSection(slotsRef)}
              >
                Check Availability
              </button>
            </div>
          </div>
          <div className="hero-right animate-slide-right">
            <img src={heroImg} alt="Car Parking" className="hero-img" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="section about-section full-screen-section animate-fade-up">
        <h2>About Parkly</h2>
        <p>
          Parkly is a modern car park management system that saves your time and stress. Real-time slot availability,
          easy booking, and QR code verification make parking seamless. Designed for both users and admins to
          manage parking efficiently.
        </p>
      </section>

      {/* Privacy Section */}
      <section ref={privacyRef} className="section privacy-section full-screen-section animate-fade-up">
        <h2>Privacy & Policy</h2>
        <p>
          Parkly prioritizes user privacy. All personal and vehicle information is securely stored. Payment details
          and bookings are confidential and only used for park management and verification purposes.
        </p>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="section contact-section full-screen-section animate-fade-up">
        <h2>Contact Us</h2>
        <p>Email: support@parkly.com</p>
        <p>Phone: +94 77 123 4567</p>
        <p>Address: 123 Parkly Street, Colombo, Sri Lanka</p>
      </section>

      {/* Availability Section */}
      <section ref={slotsRef} className="section availability-section full-screen-section animate-fade-up">
        <div className="availability-table-container">
          <h2>Slot Availability</h2>
          {loading ? (
            <p style={{ color: "#333" }}>Loading slots...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Slot Number</th>
                  <th>Status</th>
                  <th>Price (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {slotsData.map((slot) => (
                  <tr key={slot._id || slot.id}>
                    <td>{slot.slotNumber || slot.id}</td>
                    <td
                      style={{
                        backgroundColor: getStatusColor(slot.status),
                        color: slot.status.toLowerCase() === "pending" ? "#333" : "#fff",
                        textAlign: "center",
                        fontWeight: 600,
                        borderRadius: "6px",
                      }}
                    >
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </td>
                    <td>{slot.price ? `LKR ${slot.price}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Book Slot Section */}
      <section ref={bookRef} className="section book-section full-screen-section animate-fade-up">
        <h2>Book a Slot</h2>
        <p>
          Login or register to reserve your preferred parking slot instantly. Parkly makes your parking hassle-free and secure.
        </p>
      </section>

      {/* Scroll to top button */}
      <ScrollTopButton />
    </div>
  );
};

export default LandingPage;
