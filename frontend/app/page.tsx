"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Curated Problem Tracks",
    body: "Follow structured learning paths covering Dynamic Programming, Graphs, Trees, and more — designed for interview mastery.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    title: "Async Execution Engine",
    body: "Code is queued, compiled, and graded by worker goroutines. Real-time verdicts via Server-Sent Events.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: "Redis-Backed State",
    body: "Submission state stored in Redis with TTL. No memory leaks, horizontally scalable, persisted across restarts.",
  },
];

const stats = [
  { value: "8+", label: "Problems" },
  { value: "3", label: "Difficulty Levels" },
  { value: "∞", label: "Submissions" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "96px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="animate-fade-in"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(79,70,229,0.12)",
              border: "1px solid rgba(79,70,229,0.3)",
              color: "var(--color-primary)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--color-primary-container)", fontSize: 14 }}>⚡</span>
            Open Source Online Judge
          </span>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Master the Art
            <br />
            <span className="gradient-text">of Code.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 17,
              color: "var(--color-text-muted)",
              maxWidth: 560,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Prepare for technical interviews with a curated problem set, an
            IDE-grade editor, and instant verdicts powered by an async execution
            engine.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/problems" className="btn-primary" style={{ fontSize: 15, padding: "11px 28px" }}>
              Start Solving →
            </Link>
            {!user && (
              <Link href="/auth" className="btn-ghost" style={{ fontSize: 15, padding: "11px 28px" }}>
                Create Account
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginTop: 16,
              paddingTop: 20,
              borderTop: "1px solid var(--color-border)",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
              >
                <span
                  className="gradient-text"
                  style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px 80px",
          width: "100%",
        }}
      >
        {/* Section label */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-primary)",
              fontFamily: "var(--font-mono)",
              marginBottom: 10,
            }}
          >
            Platform capabilities
          </p>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Engineered for Mastery
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-in"
              style={{
                animationDelay: `${i * 80}ms`,
                background: "var(--color-surface-container)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transition: "border-color 200ms, background 200ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border-hover)";
                (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface-high)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface-container)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(79,70,229,0.15)",
                  border: "1px solid rgba(79,70,229,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA footer strip ──────────────────────────────────── */}
      {!user && (
        <section
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 24px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "var(--color-surface-low)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "40px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                  marginBottom: 6,
                }}
              >
                Ready to begin?
              </h3>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
                Join Project Z and start solving problems today. It&apos;s free.
              </p>
            </div>
            <Link href="/auth" className="btn-primary" style={{ fontSize: 14, padding: "10px 24px", whiteSpace: "nowrap" }}>
              Get Started →
            </Link>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid var(--color-border)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
          Project Z © 2025
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Terms", "Privacy", "Careers", "Support"].map((l) => (
            <span key={l} style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
