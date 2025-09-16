import { useState } from "react";
import axios from "axios";

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    location: "",
    type: "Garbage",
    description: "",
    photo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.type);
    data.append("description", formData.description);
    data.append("location", formData.location);
    if (formData.photo) {
      data.append("image", formData.photo); // backend multer expects "image"
    }

    try {
      const res = await axios.post("http://localhost:5000/api/upload/report", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Issue Submitted Successfully!");
      console.log("Saved Issue:", res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to submit issue");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Report an Environmental Issue</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <select name="type" onChange={handleChange} required>
          <option>Garbage</option>
          <option>Water</option>
          <option>Noise</option>
          <option>Tree Cutting</option>
          <option>Others</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        <button type="submit" style={{ padding: "8px 16px", background: "blue", color: "white", border: "none" }}>
          Submit
        </button>
      </form>
    </div>
  );
}
