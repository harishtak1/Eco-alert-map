import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api/auth";

export default function LoginSignupPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", category: "garbage" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? `${API}/login` : `${API}/signup`;
      const res = await axios.post(url, form);

      // ✅ Role logic
      const role = res.data.email === "admin@example.com" ? "admin" : "user";

      login({
        email: res.data.email,
        role,
        token: res.data.token,
      });

      alert("✅ Logged in!");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          {isLogin ? "🔐 Login" : "📝 Signup"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />

          {/* ✅ Category Dropdown (Garbage, Water, Noise, Tree Cutting, Other) */}
          {!isLogin && (
            <select
              name="category"
              value={form.category}
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
          )}

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
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            marginTop: "15px",
            background: "transparent",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          {isLogin ? "Create new account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
