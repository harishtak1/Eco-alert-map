import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:5000/api/notifications";
const USER = "dummyUser123";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  const fetchNotifs = async () => {
    try {
      const res = await axios.get(`${API}/${USER}`);
      setNotifs(res.data);
    } catch (err) {
      console.error("❌ Error fetching notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API}/${id}/read`);
      fetchNotifs();
    } catch (err) {
      console.error("❌ Error updating notification", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Graph data
  const pending = notifs.filter((n) => n.status === "pending").length;
  const approved = notifs.filter((n) => n.status === "approved").length;
  const rejected = notifs.filter((n) => n.status === "rejected").length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Title with counter */}
      <h1
        style={{
          color: "#222",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span
            style={{
              background: "#d32f2f",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </h1>

      {/* Graph Section */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontSize: "18px",
            color: "#444",
          }}
        >
          📊 Status Overview
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#1976d2"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Notifications list */}
      {notifs.length === 0 ? (
        <p style={{ color: "#666", fontSize: "16px" }}>No notifications</p>
      ) : (
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {notifs.map((n) => (
            <div
              key={n._id}
              style={{
                background: n.read ? "#ffffff" : "#e3f2fd",
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  color: "#333",
                  fontSize: "15px",
                  fontWeight: n.read ? "normal" : "bold",
                }}
              >
                {n.message}
              </span>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  style={{
                    marginLeft: "15px",
                    padding: "6px 14px",
                    background: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#1565c0")}
                  onMouseOut={(e) => (e.target.style.background = "#1976d2")}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
