import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API = "http://localhost:5000";

export default function HomePage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/alerts`)
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching alerts:", err);
        setLoading(false);
      });
  }, []);

  const center = [28.6139, 77.209]; // Default: Delhi

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
          fontSize: 18,
          fontWeight: "bold",
          color: "#2e7d32",
        }}
      >
        ⏳ Loading Eco Map...
      </div>
    );

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        background: "linear-gradient(135deg, #f1f8e9, #e0f2f1)",
      }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* ✅ Map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ Alerts markers */}
        {alerts.map((a) => {
          const lat = typeof a.lat === "number" ? a.lat : center[0];
          const lng = typeof a.lng === "number" ? a.lng : center[1];

          return (
            <Marker key={a._id} position={[lat, lng]}>
              <Popup>
                <div
                  style={{
                    minWidth: 180,
                    maxWidth: 240,
                    padding: "6px",
                    borderRadius: "8px",
                    background: "#f9fbe7",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <h4 style={{ margin: "0 0 4px", color: "#2e7d32" }}>{a.title}</h4>
                  <p style={{ margin: "0 0 4px", fontSize: 13 }}>📍 {a.location}</p>
                  <p style={{ margin: "0 0 6px", fontSize: 13 }}>📝 {a.description}</p>

                  {a.status && (
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: 6,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        backgroundColor:
                          a.status === "approved"
                            ? "#4caf50"
                            : a.status === "rejected"
                            ? "#f44336"
                            : "#ff9800",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {a.status.toUpperCase()}
                    </span>
                  )}

                  {a.imageUrl && (
                    <div style={{ marginTop: 6 }}>
                      <img
                        src={a.imageUrl}
                        alt="Alert"
                        style={{
                          width: "100%",
                          borderRadius: 6,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
