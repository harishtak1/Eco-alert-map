import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AuthContext } from "../context/AuthContext";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API = "http://localhost:5000/api/alerts";

export default function MapPage() {
  const { token } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const center = [28.6139, 77.2090]; // Default: Delhi

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {alerts.map(alert => (
        <Marker key={alert._id} position={[alert.lat || center[0], alert.lng || center[1]]}>
          <Popup>
            <strong>{alert.title}</strong><br/>
            {alert.description}<br/>
            📍 {alert.location}<br/>
            {alert.status && (
              <span style={{
                display: "inline-block",
                marginTop: "4px",
                padding: "2px 6px",
                borderRadius: "6px",
                backgroundColor: alert.status === "approved" ? "green" : alert.status === "rejected" ? "red" : "orange",
                color: "white",
                fontSize: "12px"
              }}>
                {alert.status}
              </span>
            )}
            {alert.imageUrl && <img src={alert.imageUrl} alt="alert" style={{ width: 160, borderRadius: 6, marginTop: 4 }} />}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
