import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const API = "http://localhost:5000";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  // Fetch all alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API}/api/alerts`);
        setAlerts(res.data.reverse()); // latest first
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
  }, []);

  // Default center
  const defaultCenter = [26.9124, 75.7873];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: 20 }}>
        🌍 Eco Alerts Map
      </h1>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{
          height: 400,
          width: "100%",
          marginBottom: 30,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {alerts.map((a) => (
          <Marker
            key={a._id}
            position={[a.lat || defaultCenter[0], a.lng || defaultCenter[1]]}
          >
            <Popup>
              <b>{a.title}</b>
              <br />
              {a.description}
              <br />
              {a.location}
              {a.imageUrl && (
                <div style={{ marginTop: 6 }}>
                  <img
                    src={a.imageUrl}
                    alt=""
                    style={{ width: 160, borderRadius: 6 }}
                  />
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <h2 style={{ color: "#1b5e20", marginBottom: 15 }}>📋 All Reports</h2>
      {alerts.map((a) => (
        <div
          key={a._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 16,
            padding: 16,
            borderRadius: 10,
            background: "#ffffffdd",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 6px", color: "#2e7d32" }}>{a.title}</h3>
          <p style={{ margin: "4px 0" }}>{a.description}</p>
          <p style={{ margin: "4px 0", fontStyle: "italic" }}>{a.location}</p>
          {a.imageUrl && (
            <img
              src={a.imageUrl}
              alt=""
              style={{ maxWidth: 240, borderRadius: 6, marginTop: 8 }}
            />
          )}

          {/* Customized Button */}
          <button
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1b5e20")}
            onMouseOut={(e) => (e.target.style.background = "#2e7d32")}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
