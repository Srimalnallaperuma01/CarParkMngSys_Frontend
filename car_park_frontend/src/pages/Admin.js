import { Link } from "react-router-dom";

export default function Admin(){
  return (
    <div className="container">
      <div className="card" style={{textAlign:"center"}}>
        <h2 className="h1">Admin</h2>
        <Link to="/admin/login"><button>Admin Login</button></Link>
        <Link to="/admin/dashboard" style={{marginLeft:12}}><button>Dashboard</button></Link>
      </div>
    </div>
  );
}
