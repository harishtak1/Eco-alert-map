import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API = "http://localhost:5000/api/alerts";

export default function ReportIssuePage() {
  const [form, setForm] = useState({
    title: "garbage",
    description: "",
    location: "",
    lat: "",
    lng: "",
  });
  const [file, setFile] = useState(null);

  // ✅ Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ✅ Map click handler
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setForm({
          ...form,
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
        });
      },
    });

    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]}></Marker>
    ) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("image", file);

    try {
      await axios.post(API, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Report submitted!");
      setForm({
        title: "garbage",
        description: "",
        location: "",
        lat: "",
        lng: "",
      });
      setFile(null);
    } catch {
      alert("❌ Failed to submit");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "500px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
          📝 Report an Issue
        </h2>

        {/* ✅ Category Dropdown */}
        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "white",
          }}
        >
          <option value="garbage">🗑 Garbage</option>
          <option value="water">💧 Water</option>
          <option value="noise">🔊 Noise</option>
          <option value="tree-cutting">🌳 Tree Cutting</option>
          <option value="other">➕ Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe the issue..."
          value={form.description}
          onChange={handleChange}
          required
          rows="3"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        {/* ✅ Map to pick Lat/Lng */}
        <div style={{ height: "250px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
          <MapContainer
            center={[28.6139, 77.209]} // Default Delhi
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Lat/Lng readonly fields */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            name="lat"
            placeholder="Latitude"
            value={form.lat}
            readOnly
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f9f9f9",
            }}
          />
          <input
            name="lng"
            placeholder="Longitude"
            value={form.lng}
            readOnly
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f9f9f9",
            }}
          />
        </div>

        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#45a049")}
          onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
        >
          🚀 Submit Report
        </button>
      </form>
    </div>
  );
}
