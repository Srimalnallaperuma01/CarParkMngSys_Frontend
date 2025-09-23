import { useState } from 'react';
import axios from 'axios';

export default function AddAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/register`, { name, email, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Admin added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding admin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Add Admin</button>
    </form>
  );
}
