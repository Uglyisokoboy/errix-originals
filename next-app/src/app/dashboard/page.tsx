"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard user", user);
    if (user === null) return; // still loading
    if (!user || user.role !== "admin") {
      router.replace("/admin-login");
    }
  }, [user, router]);

  if (!user) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Checking admin access...</div>;
  }

  if (user.role !== "admin") {
    return null; // Will redirect
  }

  // Placeholder stats
  const stats = [
    { icon: "fa-box", number: 6, label: "Products" },
    { icon: "fa-bullhorn", number: 3, label: "Campaigns" },
    { icon: "fa-users", number: 500, label: "Girls Empowered" },
    { icon: "fa-school", number: 25, label: "Schools Reached" },
  ];

  // Navigation cards
  const navs = [
    { icon: "fa-box", title: "Manage Products", href: "/products" },
    { icon: "fa-bullhorn", title: "Manage Campaigns", href: "/campaigns" },
    { icon: "fa-user", title: "My Account", href: "/my-account" },
    { icon: "fa-sign-out-alt", title: "Logout", href: "/logout" },
  ];

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <i className="fas fa-shoe-prints"></i>
            </div>
            <div className="brand-text">
              <h1>Errix Originals</h1>
              <p>Admin Dashboard</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="page-header">
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome! Manage products, campaigns, and view impact stats.</div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div className="stat-card" key={idx}>
              <div className="stat-icon">
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <section className="nav-section">
          <div className="section-header">
            <div className="section-title">Quick Navigation</div>
          </div>
          <div className="nav-grid">
            {navs.map((nav, idx) => (
              <a className="nav-card" href={nav.href} key={idx}>
                <div className="nav-icon">
                  <i className={`fas ${nav.icon}`}></i>
                </div>
                <div className="nav-title">{nav.title}</div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
} 