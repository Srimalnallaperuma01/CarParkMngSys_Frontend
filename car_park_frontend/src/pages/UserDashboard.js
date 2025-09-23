import { useEffect, useState } from "react";
import axios from "axios";
import BookSlot from "../components/Booking/BookSlot";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [slots, setSlots] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user profile (dummy for now)
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch parking slots (dummy data for now)
    const fetchSlots = () => {
      const dummySlots = [];
      for (let i = 1; i <= 20; i++) {
        dummySlots.push({
          _id: `slot-${i}`,
          slotNumber: `P${i}`,
          location: `Level ${Math.ceil(i / 5)}`,
          price: 200 + i * 10,
          status: "Available"
        });
      }
      setSlots(dummySlots);
    };

    fetchUser();
    fetchSlots();
  }, []);

  return (
    <div className="dashboard">
      <div className="profile-card">
        <img src={user.profilePic || "https://via.placeholder.com/100"} alt="Profile" />
        <h2>{user.name || "John Doe"}</h2>
        <p>Email: {user.email || "john@example.com"}</p>
        <p>NIC: {user.nic || "991234567V"}</p>
        <p>Vehicle: {user.vehicleNumber || "ABC-1234"}</p>
      </div>

      <div className="slots-container">
        <h2>Available Parking Slots</h2>
        <div className="slots-grid">
          {slots.map((slot) => (
            <div key={slot._id} className="slot-card">
              <h3>{slot.slotNumber}</h3>
              <p>{slot.location}</p>
              <p>LKR {slot.price}</p>
              <p>Status: {slot.status}</p>
              <BookSlot slotId={slot._id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
