import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Car Park System</h1>
      <div style={{textAlign: 'center'}}>
        <Link to="/login" style={{marginRight: '1rem'}}>Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
