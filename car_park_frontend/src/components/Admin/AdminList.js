import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    };
    fetchAdmins();
  }, []);

  const deleteAdmin = async id => {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`${process.env.REACT_APP_API_URL}/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAdmins(admins.filter(a => a._id !== id));
  };

  return (
    <ul>
      {admins.map(a => (
        <li key={a._id}>
          {a.name} ({a.email})
          <button onClick={() => deleteAdmin(a._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
