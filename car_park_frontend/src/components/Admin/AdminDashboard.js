import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard(){
  const [admins, setAdmins] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ slotNumber:"", location:"", price:"" });

  useEffect(()=>{ fetchAdmins(); fetchSlots(); }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin`, { headers:{ Authorization:`Bearer ${token}` }});
      setAdmins(res.data);
    } catch (err){ console.error(err); }
  };

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/parking`, { headers:{ Authorization:`Bearer ${token}` }});
      setSlots(res.data);
    } catch (err){ console.error(err); }
  };

  const addSlot = async () => {
    if (!form.slotNumber || !form.price) return alert("Slot number & price required");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/parking`, form, { headers:{ Authorization:`Bearer ${token}` }});
      setSlots(prev=>[res.data, ...prev]);
      setForm({ slotNumber:"", location:"", price:"" });
    } catch (err){ alert(err.response?.data?.message || "Error adding slot"); }
  };

  const deleteSlot = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/parking/${id}`, { headers:{ Authorization:`Bearer ${token}` }});
      setSlots(prev => prev.filter(s=>s._id !== id));
    } catch (err) { console.error(err); alert("Delete failed"); }
  };

  const deleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/${id}`, { headers:{ Authorization:`Bearer ${token}` }});
      setAdmins(prev=>prev.filter(a=>a._id !== id));
    } catch (err){ console.error(err); alert("Delete admin failed"); }
  };

  return (
    <div className="container">
      <h2 className="h1">Admin Dashboard</h2>

      <div className="card">
        <h3>Add Parking Slot</h3>
        <input placeholder="Slot Number" value={form.slotNumber} onChange={e=>setForm({...form, slotNumber:e.target.value})} />
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
        <button onClick={addSlot}>Add Slot</button>
      </div>

      <div className="card">
        <h3>Existing Slots</h3>
        <div className="grid">
          {slots.map(s => (
            <div className="card" key={s._id}>
              <p><strong>{s.slotNumber}</strong></p>
              <p className="small">{s.location}</p>
              <p>LKR {s.price}</p>
              <button onClick={()=>deleteSlot(s._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Manage Admins</h3>
        <div>
          {admins.map(a => (
            <div key={a._id} style={{display:"flex",justifyContent:"space-between", alignItems:"center"}}>
              <div><strong>{a.name}</strong> <div className="small">{a.email}</div></div>
              <button onClick={()=>deleteAdmin(a._1d || a._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
