import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #eee",
        alignItems: "center",
      }}
    >
      <Link to="/">Home</Link>

      {/* ✅ Only show when logged in */}
      {user && <Link to="/report">Report</Link>}
      {user && <Link to="/alerts">Alerts</Link>}
      {user && <Link to="/notifications">Notifications</Link>}

      {/* ✅ Admin option only if role=admin */}
      {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

      {/* ✅ If logged in → show logout, else show login/signup */}
      {user ? (
        <button
          onClick={logout}
          style={{
            marginLeft: "auto",
            background: "red",
            color: "white",
            border: "none",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <Link to="/auth" style={{ marginLeft: "auto" }}>
          Login/Signup
        </Link>
      )}
    </nav>
  );
}
