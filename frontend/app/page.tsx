"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

const features = [
  {
    icon: "speed",
    title: "High Speed Judging",
    body: "Distributed execution clusters ensure sub-millisecond evaluation latency. Your code runs instantly against massive test suites.",
    stat: "LATENCY: < 5ms",
  },
  {
    icon: "analytics",
    title: "Real-time Feedback",
    body: "Deep statistical analysis of your submission. Memory profiling, CPU cycles, and algorithmic efficiency visualized instantly.",
    stat: "STATUS: ACTIVE",
  },
  {
    icon: "dataset",
    title: "Elite Problem Sets",
    body: "Curated algorithmic challenges from top competitive programming events globally. Designed to break naive implementations.",
    stat: "DATASET: 300+",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [typedText, setTypedText] = useState("");
  const fullText = 'System.out.println("Ready for execution.");';

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      {/* ── Hero Section with Terminal Theme ──────────────── */}
      <section
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 680,
          padding: "80px 16px",
        }}
      >
        <div style={{ maxWidth: 720, width: "100%", zIndex: 10, position: "relative" }}>
          {/* Terminal Window */}
          <div
            style={{
              background: "var(--color-surface-low)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(0, 242, 255, 0.05)",
            }}
          >
            {/* Terminal Header */}
            <div
              style={{
                background: "var(--color-surface-highest)",
                borderBottom: "1px solid var(--color-border)",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-border)" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-border)" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-border)" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                zsh — Project Z
              </div>
              <div style={{ width: 48 }} />
            </div>

            {/* Terminal Body */}
            <div style={{ padding: "24px 32px", fontFamily: "var(--font-mono)", fontSize: 14 }}>
              <div style={{ marginBottom: 16, color: "var(--color-text-secondary)" }}>
                $ ./init_environment.sh
              </div>
              <div style={{ marginBottom: 16, color: "var(--color-text-muted)", opacity: 0.7, lineHeight: 1.6 }}>
                &gt; Loading modules... [OK]<br />
                &gt; Establishing secure connection... [OK]<br />
                &gt; Preparing problem sets... [OK]
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                  marginBottom: 16,
                }}
              >
                Welcome to the <span style={{ color: "#00f2ff" }}>Elite Level</span>.
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--color-text-secondary)",
                  maxWidth: 540,
                  marginBottom: 28,
                }}
              >
                A high-performance integrated environment designed for competitive
                programmers. Millisecond execution, real-time analytics, and
                uncompromising precision.
              </p>

              <div style={{ display: "flex", alignItems: "center", color: "#00f2ff", fontWeight: 700 }}>
                <span style={{ marginRight: 8 }}>&gt;</span>
                <span>{typedText}</span>
                <span className="terminal-cursor" />
              </div>
            </div>
          </div>

          {/* CTA Actions */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Link
              href="/problems"
              className="glow-btn"
              style={{
                padding: "12px 32px",
                background: "#00f2ff",
                color: "#131313",
                fontWeight: 700,
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontSize: 15,
                transition: "all 0.3s ease",
              }}
            >
              Start Coding
            </Link>
            {!user && (
              <Link
                href="/auth"
                className="btn-ghost"
                style={{ fontSize: 15, padding: "12px 32px" }}
              >
                View Documentation
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Feature Highlights Bento Grid ──────────────────── */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          padding: "0 32px 80px",
        }}
      >
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 24,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: 10,
            }}
          >
            Engineered for Performance
          </h2>
          <div
            style={{
              width: 64,
              height: 3,
              background: "#00f2ff",
              margin: "0 auto",
              borderRadius: "var(--radius-md)",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-in card-hover"
              style={{
                animationDelay: `${i * 80}ms`,
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-border)",
                padding: 24,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-highest)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#00f2ff", fontVariationSettings: "'FILL' 1" }}
                >
                  {f.icon}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {f.body}
              </p>
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid var(--color-border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--color-text-muted)",
                  opacity: 0.7,
                }}
              >
                {f.stat}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Minimal Footer ────────────────────────────────── */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-lowest)",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        <div style={{ color: "var(--color-text-secondary)" }}>
          <span style={{ color: "#00f2ff", fontWeight: 700 }}>Project Z</span> © 2025. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Terms", "Privacy", "Status"].map((l) => (
            <span
              key={l}
              style={{
                color: "var(--color-text-muted)",
                cursor: "pointer",
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLSpanElement).style.color = "#00f2ff";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLSpanElement).style.color = "var(--color-text-muted)";
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
