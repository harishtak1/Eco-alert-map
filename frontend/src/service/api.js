// src/services/api.js
const BASE_URL = "http://localhost:5000";

export async function getAlerts() {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function addAlert(payload) {
  const res = await fetch(`${BASE_URL}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create alert");
  }
  return res.json();
}
