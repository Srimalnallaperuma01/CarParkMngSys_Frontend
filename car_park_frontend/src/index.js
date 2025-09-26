import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/UserContext";  // ✅ Added
import { BookingProvider } from "./context/BookingContext"; // ✅ Added
import { SlotsProvider } from "./context/SlotContext"; // ✅ Added
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BookingProvider>
          <SlotsProvider>
            <App />
          </SlotsProvider>
        </BookingProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
