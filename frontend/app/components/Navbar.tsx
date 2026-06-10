"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--color-surface-lowest)",
        borderBottom: "1px solid var(--color-border)",
        height: 56,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          {/* Code icon */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 6,
              background: "var(--color-primary-container)",
              color: "#fff",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              flexShrink: 0,
            }}
          >
            Z
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Z
          </span>
        </Link>

        {/* Center nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { href: "/problems", label: "Problems" },
            { href: "/dashboard", label: "Dashboard" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "6px 14px",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-text-muted)",
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
                transition: "color 150ms, background 150ms",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  "var(--color-text-primary)";
                (e.target as HTMLAnchorElement).style.background =
                  "var(--color-surface-high)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  "var(--color-text-muted)";
                (e.target as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--color-primary-container)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {user.name}
                  {user.role === "admin" && (
                    <span
                      style={{
                        padding: "1px 6px",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(79, 70, 229, 0.18)",
                        color: "var(--color-primary)",
                        border: "1px solid rgba(79, 70, 229, 0.35)",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: "5px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-text-muted)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "border-color 150ms, color 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor =
                    "var(--color-border-hover)";
                  (e.target as HTMLButtonElement).style.color =
                    "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor =
                    "var(--color-border)";
                  (e.target as HTMLButtonElement).style.color =
                    "var(--color-text-muted)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary" style={{ fontSize: 13, padding: "6px 16px" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
