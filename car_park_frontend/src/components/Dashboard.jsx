// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Dashboard.css";

// Leaflet imports
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Marker for selecting destination
const DestinationMarker = ({ destinationPosition, setDestinationPosition }) => {
  useMapEvents({
    click(e) {
      setDestinationPosition(e.latlng);
    },
  });
  return destinationPosition ? <Marker position={destinationPosition} /> : null;
};

// Haversine distance (optional)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [slotsData, setSlotsData] = useState([]);

  const [startPosition, setStartPosition] = useState(null); // user current location
  const [destinationPosition, setDestinationPosition] = useState(null); // clicked or input
  const [destinationInput, setDestinationInput] = useState(""); // address input
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 });

  const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE4MmQxYjJmNmYyNTQwNzhiZjljMWQ5NjM3OTNmM2M0IiwiaCI6Im11cm11cjY0In0="; // replace with your key

  // Fetch bookings & get user GPS
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axiosInstance.get("/bookings");
        const bookings = res.data.bookings || res.data;

        const filteredBookings = bookings.filter((b) =>
          ["pending", "approved"].includes(b.status.toLowerCase())
        );

        const mappedSlots = filteredBookings.map((b) => ({
          id: b.slot?.slotNumber || b.slot?.name || "Unknown",
          status: b.status.toLowerCase(),
          date: b.date ? new Date(b.date).toLocaleDateString() : null,
          payment: b.paymentSlip ? "Received" : "Not Received",
        }));

        setSlotsData(mappedSlots);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchSlots();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setStartPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setStartPosition({ lat: 5.9381636, lng: 80.576851 }) // fallback Colombo
      );
    } else {
      setStartPosition({ lat: 5.9381636, lng: 80.576851 });
    }
  }, []);

  // Slot helpers
  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "booked":
        return "Approved";
      case "pending":
        return "Pending Approval";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "booked":
        return "slot-booked";
      case "pending":
        return "slot-pending";
      default:
        return "slot-unknown";
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Get route from ORS
  const getRoute = async (destPos) => {
    if (!startPosition || !destPos) return;

    const start = `${startPosition.lng},${startPosition.lat}`;
    const end = `${destPos.lng},${destPos.lat}`;

    try {
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`
      );
      const data = await res.json();
      const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const distance = data.features[0].properties.summary.distance / 1000; // km
      const duration = data.features[0].properties.summary.duration / 60; // min

      setRouteCoords(coords);
      setRouteInfo({ distance, duration });
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  // Handle destination submit (address input)
  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    let destPos = destinationPosition;

    if (!destPos && destinationInput) {
      // Geocode address
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationInput)}`
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          destPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
          setDestinationPosition(destPos);
        } else {
          alert("Address not found!");
          return;
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        return;
      }
    }

    if (destPos) getRoute(destPos);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h3>User Dashboard</h3>
        <ul>
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">Home</Link>
          </li>
          <li className={location.pathname.includes("/book-slot") ? "active" : ""}>
            <Link to="/dashboard/book-slot">Book Slot</Link>
          </li>
          <li className={location.pathname.includes("/my-bookings") ? "active" : ""}>
            <Link to="/dashboard/my-bookings">My Bookings</Link>
          </li>
          <li className={location.pathname.includes("/payments") ? "active" : ""}>
            <Link to="/dashboard/payments">Payments</Link>
          </li>
          <li className={location.pathname.includes("/notifications") ? "active" : ""}>
            <Link to="/dashboard/notifications">Notifications</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </li>
        </ul>
      </nav>

      <main className="dashboard-main">
        {/* Slots Section */}
        <div className="slots-preview">
          {slotsData.length === 0 ? (
            <p>No pending or approved bookings yet.</p>
          ) : (
            slotsData.map((slot, idx) => (
              <div
                key={idx}
                className={`slot-card ${getStatusClass(slot.status)}`}
                title={`Slot ${slot.id} - ${formatStatus(slot.status)}${
                  slot.date ? ` - ${slot.date}` : ""
                } - Payment: ${slot.payment}`}
              >
                <span className="slot-id">{slot.id}</span>
                {slot.date && <small className="slot-date">{slot.date}</small>}
                <small className="slot-status">{formatStatus(slot.status)}</small>
                <small className="slot-payment">Payment: {slot.payment}</small>
              </div>
            ))
          )}
        </div>

        {/* Map & Directions: only for /dashboard */}
        {location.pathname === "/dashboard" && startPosition && (
          <div style={{ marginTop: "40px" }}>
            <h3>Map & Directions</h3>

            <form onSubmit={handleDestinationSubmit} style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Enter destination address or coordinates"
                value={
                  destinationPosition
                    ? `${destinationPosition.lat.toFixed(5)}, ${destinationPosition.lng.toFixed(5)}`
                    : destinationInput
                }
                onChange={(e) => setDestinationInput(e.target.value)}
                style={{ padding: "8px", width: "300px", marginRight: "10px" }}
              />
              <button type="submit">Get Route</button>
              <button
  type="button"
  onClick={() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setStartPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error("GPS Error:", err);
          alert("Cannot get GPS location. Please allow location access or enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }}
>
  Scan My Location
</button>

              <button
                type="button"
                onClick={() => {
                  setDestinationPosition(null);
                  setRouteCoords([]);
                  setDestinationInput("");
                }}
                style={{ marginLeft: "10px" }}
              >
                Refresh
              </button>
            </form>

            <MapContainer
              center={startPosition}
              zoom={13}
              style={{ height: "400px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={startPosition} />
              <DestinationMarker
                destinationPosition={destinationPosition}
                setDestinationPosition={setDestinationPosition}
              />
              {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
            </MapContainer>

            {destinationPosition && routeCoords.length > 0 && (
              <p>
                Distance: {routeInfo.distance.toFixed(2)} km, Duration: {routeInfo.duration.toFixed(1)} min
              </p>
            )}
          </div>
        )}

        <Outlet context={{ slotsData, setSlotsData }} />
      </main>
    </div>
  );
};

export default Dashboard;
