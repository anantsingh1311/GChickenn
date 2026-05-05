import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";

import brandLogo from "../brand-logo.JPG";
import { API_URL } from "../config";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Order Now", to: "/order" }
];

function getStoredUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function linkClassName({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
    isActive
      ? "bg-brand-gold text-brand-deep"
      : "text-brand-cream/80 hover:bg-white/10 hover:text-white"
  ].join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-deep/80 backdrop-blur-xl">
      <div className="border-b border-brand-line/70 bg-brand-deep/70">
        <div className="page-container flex flex-col gap-3 py-3 text-sm text-brand-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-sand">
              Farm-raised quality
            </span>
            <span className="hidden sm:inline">Fresh chicken with trusted doorstep delivery.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {user?.role?.toLowerCase() === "admin" ? (
              <Link
                to="/admin"
                className="rounded-full px-3 py-1.5 text-brand-sand transition hover:bg-white/10 hover:text-white"
              >
                Admin
              </Link>
            ) : null}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-3 py-1.5 text-brand-sand transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-3 py-1.5 text-brand-sand transition hover:bg-white/10 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-brand-line bg-white/5 px-4 py-1.5 text-brand-cream transition hover:border-brand-gold/50 hover:bg-white/10"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="page-container py-4">
        <div className="surface-panel flex items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={brandLogo}
              alt="GChickenn logo"
              className="h-12 w-12 rounded-full border border-brand-line object-cover shadow-lg shadow-brand-deep/30"
            />

            <div className="min-w-0">
              <p className="font-display text-3xl leading-none text-brand-gold sm:text-4xl">
                GChickenn
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-brand-cream/55">
                Premium fresh poultry
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white/5 text-brand-cream transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span className="text-lg">{mobileOpen ? "X" : "="}</span>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {mobileOpen ? (
          <nav className="surface-panel mt-3 flex flex-col gap-2 p-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
