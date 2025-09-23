import { useEffect, useState } from "react";
import axios from "axios";
import BookSlot from "../components/Booking/BookSlot";

export default function UserDashboard(){
  const [slots, setSlots] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      // leave slots empty or redirect to login as needed
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        const slotsRes = await axios.get(`${process.env.REACT_APP_API_URL}/parking`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSlots(slotsRes.data);
      } catch (err) {
        console.error(err);
        alert("Error loading dashboard data");
      }
    };
    fetchData();
  }, []);

  const handleBooked = (bookingData) => {
    // optionally update UI
  };

  return (
    <div className="container">
      <h2 className="h1">User Dashboard</h2>
      <div className="card" style={{display:"flex",gap:16,alignItems:"center"}}>
        <img className="profile-pic" src={user?.profilePic || "https://i.pravatar.cc/150"} alt="profile" />
        <div>
          <h3>{user?.username || user?.name || "Guest User"}</h3>
          <p className="small">Email: {user?.email}</p>
          <p className="small">Vehicle: {user?.vehicleNumber || "-"}</p>
        </div>
      </div>

      <h3 style={{marginTop:20}}>Available Slots</h3>
      <div className="grid">
        {slots.map(slot => (
          <div className="card" key={slot._id}>
            <p><strong>{slot.slotNumber}</strong></p>
            <p className="small">{slot.location}</p>
            <p>LKR {slot.price}</p>
            <p className="small">Status: {slot.status}</p>
            <BookSlot slotId={slot._id} slotNumber={slot.slotNumber} onBooked={handleBooked} />
          </div>
        ))}
      </div>
    </div>
  );
}
