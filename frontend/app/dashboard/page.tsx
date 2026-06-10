"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface Submission {
  id: number;
  language: string;
  problem_id: number;
  state: string;
  verdict?: string;
  execution_time: number;
}

interface UserStats {
  total_submissions: number;
  solved_problems: number;
  failed_problems: number;
  submissions: Submission[];
}

function VerdictChip({ state, verdict }: { state: string; verdict?: string }) {
  const label = verdict || state;
  const ok = label === "Accepted" || state === "COMPLETED";
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--font-mono)",
        color: ok ? "#22c55e" : "#ef4444",
        background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const { user, token, loading: authLoading, API_URL } = useAuth();
  const router = useRouter();
  const [stats, setStats]   = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth"); return; }
    if (token) fetchStats();
  }, [user, token, authLoading]);

  const fetchStats = async () => {
    try {
      const res  = await fetch(`${API_URL}/api/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  if (!user) return null;

  const submissions: Submission[] = stats?.submissions || [];

  const successRate =
    (stats?.total_submissions ?? 0) > 0
      ? (
          ((stats?.solved_problems ?? 0) /
            Math.max((stats?.solved_problems ?? 0) + (stats?.failed_problems ?? 0), 1)) *
          100
        ).toFixed(0)
      : "0";

  const statCards = [
    {
      label: "Total Submissions",
      value: stats?.total_submissions ?? 0,
      color: "var(--color-text-primary)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: "Problems Solved",
      value: stats?.solved_problems ?? 0,
      color: "#22c55e",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Failed Attempts",
      value: stats?.failed_problems ?? 0,
      color: "#ef4444",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      color: "var(--color-primary)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 24px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* ── Profile card ───────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-surface-container)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-md)",
            background: "var(--color-primary-container)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            flexShrink: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            {user.name}
            {user.role === "admin" && (
              <span
                style={{
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(79,70,229,0.18)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(79,70,229,0.35)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Admin
              </span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            {user.email}
          </p>
        </div>

        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            textAlign: "right",
          }}
        >
          <span style={{ display: "block", marginBottom: 2 }}>Progress</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--color-primary)", display: "block" }}>
            {successRate}%
          </span>
          <span>success rate</span>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--color-surface-container)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface-highest)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              {s.icon}
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 28,
                  fontWeight: 800,
                  color: s.color,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 4,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent submissions ─────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Recent Submissions
          </h2>
          <Link
            href="/problems"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-primary)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Browse Problems →
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div
            style={{
              background: "var(--color-surface-container)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>No submissions yet.</p>
            <Link href="/problems" className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }}>
              Solve a Problem →
            </Link>
          </div>
        ) : (
          <div
            style={{
              background: "var(--color-surface-container)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 120px 90px 80px",
                padding: "10px 20px",
                background: "var(--color-surface-low)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {["#", "Language", "Verdict", "Problem", "Time"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {submissions.map((s, i) => (
              <div
                key={s.id}
                className="animate-fade-in"
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr 120px 90px 80px",
                  padding: "13px 20px",
                  borderBottom: i < submissions.length - 1 ? "1px solid var(--color-border)" : "none",
                  alignItems: "center",
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {s.id}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-mono)",
                    textTransform: "capitalize",
                  }}
                >
                  {s.language}
                </span>
                <VerdictChip state={s.state} verdict={s.verdict} />
                <Link
                  href={`/problems/${s.problem_id}`}
                  style={{
                    fontSize: 12,
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  #{s.problem_id}
                </Link>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {s.execution_time > 0 ? `${s.execution_time.toFixed(0)}ms` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
