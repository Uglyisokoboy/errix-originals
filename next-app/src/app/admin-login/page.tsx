"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token && data.user.role && data.user.role.toLowerCase() === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/admin-dashboard.html";
      } else {
        setError("Invalid admin credentials.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError("Network error.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        padding: "2.5rem 2rem 2rem 2rem",
        textAlign: "center",
        position: "relative"
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, margin: "0 auto 0.5rem auto", borderRadius: 16,
            background: "linear-gradient(135deg, #000, #333)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="fas fa-shield-alt" style={{ color: "#fff", fontSize: 28 }}></i>
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, margin: 0 }}>Admin Login</h1>
          <div style={{ fontSize: "0.97rem", color: "#444", marginTop: 4 }}>
            <b>Admin:</b> errixoriginals@gmail.com / Comfortscomfort08
          </div>
        </div>
        {error && (
          <div style={{
            color: "#c00",
            marginBottom: 16,
            background: "#ffeaea",
            borderRadius: 8,
            padding: "0.7rem 1rem",
            animation: "shake 0.3s"
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
            {error}
            <style>{`
              @keyframes shake {
                0% { transform: translateX(0); }
                20% { transform: translateX(-6px); }
                40% { transform: translateX(6px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
                100% { transform: translateX(0); }
              }
            `}</style>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ marginTop: 8 }} autoComplete="off">
          <div style={{ textAlign: "left", marginBottom: 18, position: "relative" }}>
            <label htmlFor="adminEmail" style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>Email</label>
            <span style={{ position: "absolute", left: 12, top: 38, color: "#888" }}>
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="text"
              id="adminEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 0.7rem 0.7rem 2.2rem",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: "1rem",
                marginBottom: 0,
                background: "#f7f7f7"
              }}
              autoComplete="username"
            />
          </div>
          <div style={{ textAlign: "left", marginBottom: 18, position: "relative" }}>
            <label htmlFor="adminPassword" style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>Password</label>
            <span style={{ position: "absolute", left: 12, top: 38, color: "#888" }}>
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="adminPassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 2.2rem 0.7rem 2.2rem",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: "1rem",
                marginBottom: 0,
                background: "#f7f7f7"
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: 34,
                background: "none",
                border: "none",
                color: "#888",
                fontSize: 18,
                cursor: "pointer"
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`fas fa-eye${showPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "linear-gradient(90deg, #000, #333)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s, box-shadow 0.3s",
              boxShadow: loading ? "none" : "0 2px 8px rgba(0,0,0,0.08)"
            }}
            disabled={loading}
          >
            {loading ? <span><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Logging in...</span> : "Login"}
          </button>
        </form>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div[style*='max-width: 400px'] {
            padding: 1.2rem 0.5rem 1.2rem 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
} 