import React, { useState, useEffect } from "react";
import "./ScrollTopButton.css";

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      className={`scroll-top-btn ${visible ? "show" : ""}`}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
};

export default ScrollTopButton;
