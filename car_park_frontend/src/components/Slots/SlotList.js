import { useEffect, useState } from "react";
import axios from "axios";

export default function SlotList() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/parkingslots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data);
    };
    fetchSlots();
  }, []);

  return (
    <ul>
      {slots.map(slot => (
        <li key={slot._id}>{slot.location} - {slot.slotNumber} - ${slot.price}</li>
      ))}
    </ul>
  );
}
