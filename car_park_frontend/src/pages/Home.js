import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="container">
      <div className="card" style={{textAlign:"center"}}>
        <h1 className="h1">Car Park Management System</h1>
        <p className="small">Reserve, pay and enter with QR — or book on arrival.</p>
        <div style={{marginTop:16}}>
          <Link to="/login"><button style={{marginRight:8}}>User Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
        </div>
        <div style={{marginTop:12}}>
          <Link to="/admin/login">Admin login</Link> | <Link to="/admin/dashboard">Admin dashboard</Link>
        </div>
      </div>
    </div>
  );
}
