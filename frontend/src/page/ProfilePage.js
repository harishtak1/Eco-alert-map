import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/alerts";

export default function ProfilePage() {
  const [reports, setReports] = useState([]);
  const userId = "demoUser123"; // ✅ baad me auth se aayega

  useEffect(() => {
    axios.get(`${API}?userId=${userId}`)
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 My Profile</h2>
      <p><b>Name:</b> Harish (Demo)</p>
      <p><b>Email:</b> harish@example.com</p>

      <h3>📝 My Reported Issues</h3>
      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <ul>
          {reports.map(r => (
            <li key={r._id}>
              <b>{r.title}</b> ({r.status}) - {r.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
