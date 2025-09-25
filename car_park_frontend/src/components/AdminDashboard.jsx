import React, { useContext, useState } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { defaultAdmin } from "../data/defaultAdmin";
import "../components/App.css";

const AdminDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [admins, setAdmins] = useState([defaultAdmin]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Protect: Only Super Admin can access
  if (!currentUser || currentUser.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  const addAdmin = () => {
    if (!name || !email || !password) return alert("Fill all fields");
    const newAdmin = {
      id: Date.now(),
      name,
      email,
      password,
      role: "admin"
    };
    setAdmins([...admins, newAdmin]);
    setName(""); setEmail(""); setPassword("");
  };

  const removeAdmin = (id) => {
    if (id === defaultAdmin.id) return alert("Cannot remove Super Admin!");
    setAdmins(admins.filter(a => a.id !== id));
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="sidebar">
        <h3><Link id="home-link" to="/admin">Admin Panel</Link></h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="users">Manage Users</Link></li>
          <li><Link to="slots">Manage Slots</Link></li>
          <li><Link to="payments">Approve Payments</Link></li>
          <li><Link to="reports">Reports</Link></li>
          <li><Link to="analytics">Analytics</Link></li>
        </ul>
      </nav>

      <main className="admin-dashboard-content">
        <h2>Dashboard Overview</h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ padding: "10px", background: "green", color: "white", borderRadius: "5px" }}>Total Slots: 50</div>
          <div style={{ padding: "10px", background: "red", color: "white", borderRadius: "5px" }}>Booked Slots: 20</div>
          <div style={{ padding: "10px", background: "yellow", color: "black", borderRadius: "5px" }}>Pending Payments: 5</div>
        </div>

        <h3>Admins Management (Only Super Admin)</h3>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={addAdmin}>Add Admin</button>

        <ul>
          {admins.map(a => (
            <li key={a.id}>
              {a.name} ({a.email})
              {a.id !== defaultAdmin.id && (
                <button onClick={() => removeAdmin(a.id)} style={{ marginLeft: "10px" }}>Remove</button>
              )}
              {a.id === defaultAdmin.id && " (Super Admin)"}
            </li>
          ))}
        </ul>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
