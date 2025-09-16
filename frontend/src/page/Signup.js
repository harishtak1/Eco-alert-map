import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      // JWT token save
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("✅ Signup successful!");
      // Optionally redirect to login or dashboard
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Signup failed!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ padding: "8px 16px", background: "green", color: "white", border: "none", borderRadius: 4 }}>
          Signup
        </button>
      </form>
    </div>
  );
}
