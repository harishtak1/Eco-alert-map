import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/alerts";

export default function AdminPage() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Fake Admin Credentials
  const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      form.username === ADMIN_CREDENTIALS.username &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      setAdminLoggedIn(true);
    } else {
      alert("❌ Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setForm({ username: "", password: "" });
  };

  // Fetch stats + alerts if admin logged in
  useEffect(() => {
    if (adminLoggedIn) {
      fetchStats();
      fetchAlerts();
    }
  }, [adminLoggedIn]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(API);
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}/status`, { status });
      fetchStats();
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status");
    }
  };

  // ---- If admin not logged in ----
  if (!adminLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 10,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            width: 320,
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>🔐 Admin Login</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2e7d32",
                color: "white",
                padding: "10px 0",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#1b5e20")}
              onMouseOut={(e) => (e.target.style.background = "#2e7d32")}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- If admin logged in ----
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "linear-gradient(135deg, #f1f8e9, #e0f2f1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>⚙️ Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#f44336",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats ? (
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <div
            style={{
              flex: 1,
              background: "#ffffffdd",
              padding: 20,
              borderRadius: 10,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total</h3>
            <p style={{ fontSize: 20, fontWeight: "bold" }}>{stats.total}</p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#fff59d",
              padding: 20,
              borderRadius: 10,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Pending</h3>
            <p style={{ fontSize: 20, fontWeight: "bold" }}>{stats.pending}</p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#66bb6a",
              color: "white",
              padding: 20,
              borderRadius: 10,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Approved</h3>
            <p style={{ fontSize: 20, fontWeight: "bold" }}>{stats.approved}</p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#ef5350",
              color: "white",
              padding: 20,
              borderRadius: 10,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Rejected</h3>
            <p style={{ fontSize: 20, fontWeight: "bold" }}>{stats.rejected}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}

      {/* Alerts List */}
      <h3 style={{ marginTop: 40 }}>📋 All Alerts</h3>
      {alerts.length > 0 ? (
        <table
          style={{
            marginTop: 12,
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#2e7d32", color: "white" }}>
              <th style={{ padding: 10 }}>Image</th>
              <th style={{ padding: 10 }}>Title</th>
              <th style={{ padding: 10 }}>Description</th>
              <th style={{ padding: 10 }}>Location</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr
                key={a._id}
                style={{
                  background: i % 2 === 0 ? "#f9fbe7" : "#ffffff",
                  textAlign: "center",
                }}
              >
                <td style={{ padding: 10 }}>
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt="alert"
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td style={{ padding: 10 }}>{a.title}</td>
                <td style={{ padding: 10 }}>{a.description}</td>
                <td style={{ padding: 10 }}>{a.location}</td>
                <td style={{ padding: 10, fontWeight: "bold" }}>{a.status}</td>
                <td style={{ padding: 10 }}>
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(a._id, "approved")}
                        style={{
                          marginRight: 8,
                          background: "#4caf50",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(a._id, "rejected")}
                        style={{
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No alerts found</p>
      )}
    </div>
  );
}
