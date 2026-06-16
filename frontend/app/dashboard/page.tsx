"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

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
  const isWrong = label === "Wrong Answer";
  const isTLE = label === "Time Limit Exceeded";

  let chipColor = "#ffb4ab";
  let chipBg = "rgba(255,180,171,0.1)";
  let chipBorder = "rgba(255,180,171,0.25)";

  if (ok) {
    chipColor = "#79ff5b";
    chipBg = "rgba(121,255,91,0.1)";
    chipBorder = "rgba(121,255,91,0.25)";
  } else if (isWrong) {
    chipColor = "#ffb4ab";
    chipBg = "rgba(255,180,171,0.1)";
    chipBorder = "rgba(255,180,171,0.25)";
  } else if (isTLE) {
    chipColor = "#ffb4a2";
    chipBg = "rgba(255,180,162,0.1)";
    chipBorder = "rgba(255,180,162,0.25)";
  }

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-mono)",
        color: chipColor,
        background: chipBg,
        border: `1px solid ${chipBorder}`,
        padding: "3px 10px",
        borderRadius: "var(--radius-md)",
        textTransform: "capitalize",
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const { user, token, loading: authLoading, API_URL } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth"); return; }
    if (token) fetchStats();
  }, [user, token, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/stats`, {
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
      <SidebarLayout>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="spinner spinner-lg" />
        </div>
      </SidebarLayout>
    );
  }

  if (!user) return null;

  const submissions: Submission[] = stats?.submissions || [];
  const solved = stats?.solved_problems ?? 0;
  const total = (stats?.solved_problems ?? 0) + (stats?.failed_problems ?? 0);
  const totalTarget = Math.max(total, 500);

  const successRate =
    total > 0 ? ((solved / total) * 100).toFixed(1) : "0";

  // SVG progress ring calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTarget > 0 ? solved / totalTarget : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <SidebarLayout>
      <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#e1fdff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Dashboard
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 4,
              }}
            >
              Overview of your coding performance
            </p>
          </div>

          {/* Bento Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 32,
            }}
          >
            {/* Problems Solved - Circular Progress */}
            <div
              className="card-hover"
              style={{
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: 250,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                  position: "absolute",
                  top: 24,
                  left: 24,
                }}
              >
                Problems Solved
              </h3>
              <div style={{ position: "relative", width: 140, height: 140, marginTop: 16 }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50" cy="50" r={radius}
                    fill="transparent"
                    stroke="var(--color-surface-highest)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50" cy="50" r={radius}
                    fill="transparent"
                    stroke="#79ff5b"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.5s ease" }}
                  />
                  {/* Glow */}
                  <circle
                    cx="50" cy="50" r={radius}
                    fill="transparent"
                    stroke="#79ff5b"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    opacity={0.3}
                    filter="url(#glow)"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                  />
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    </filter>
                  </defs>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "#79ff5b", fontFamily: "var(--font-mono)" }}>{solved}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>/ {totalTarget}</span>
                </div>
              </div>
            </div>

            {/* Accuracy Rate */}
            <div
              className="card-hover"
              style={{
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 250,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Accuracy Rate
              </h3>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: "#00f2ff", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>
                  {successRate}<span style={{ fontSize: 24 }}>%</span>
                </div>
                <div style={{ width: "100%", marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Easy", pct: 95, color: "#79ff5b" },
                    { label: "Medium", pct: 82, color: "#00f2ff" },
                    { label: "Hard", pct: 65, color: "#ffb4ab" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
                        <span style={{ color }}>{pct}%</span>
                      </div>
                      <div style={{ width: "100%", height: 4, background: "var(--color-surface-highest)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Activity Heatmap */}
            <div
              className="card-hover"
              style={{
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                minHeight: 250,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                  marginBottom: 16,
                }}
              >
                Submission Activity
              </h3>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#131313",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gap: 3,
                    width: "100%",
                  }}
                >
                  {/* Pseudo heatmap blocks */}
                  {[20, 50, 0, 100, 0, 80, 0, 0, 30, 0, 0, 40,
                    0, 0, 90, 100, 0, 0, 20, 0, 60, 0, 10, 0,
                    0, 70, 0, 0, 30, 0, 0, 50, 80, 0, 0, 0].map((intensity, i) => (
                      <div
                        key={i}
                        style={{
                          aspectRatio: "1",
                          borderRadius: 2,
                          background: intensity === 0
                            ? "var(--color-surface-highest)"
                            : `rgba(121, 255, 91, ${intensity / 100})`,
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              Recent Submissions
            </h3>

            {submissions.length === 0 ? (
              <div
                style={{
                  background: "var(--color-surface-low)",
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
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--color-text-muted)", opacity: 0.5 }}>
                  description
                </span>
                <p style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>No submissions yet.</p>
                <Link href="/problems" className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }}>
                  Solve a Problem →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: "var(--color-surface-low)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 100px 100px",
                    padding: "12px 20px",
                    background: "var(--color-surface-container)",
                    borderBottom: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div>Time</div>
                  <div>Problem</div>
                  <div>Language</div>
                  <div>Status</div>
                </div>

                {/* Rows */}
                {submissions.map((s, i) => (
                  <div
                    key={s.id}
                    className="animate-fade-in"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr 100px 100px",
                      padding: "14px 20px",
                      borderBottom: i < submissions.length - 1 ? "1px solid var(--color-border)" : "none",
                      alignItems: "center",
                      animationDelay: `${i * 30}ms`,
                      transition: "background 200ms",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface-container)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                      #{s.id}
                    </span>
                    <Link
                      href={`/problems/${s.problem_id}`}
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        textDecoration: "none",
                        transition: "color 200ms",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLAnchorElement).style.color = "#00f2ff";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLAnchorElement).style.color = "var(--color-text-primary)";
                      }}
                    >
                      Problem #{s.problem_id}
                    </Link>
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-mono)",
                        textTransform: "capitalize",
                      }}
                    >
                      {s.language}
                    </span>
                    <VerdictChip state={s.state} verdict={s.verdict} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Status Bar */}
      <div
        style={{
          width: "100%",
          background: "var(--color-surface-lowest)",
          borderTop: "1px solid var(--color-border)",
          padding: "8px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "#00f2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>terminal</span>
          <span>user@projectz:~$ status --dashboard</span>
        </div>
        <div style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
          system optimal / ping 12ms
        </div>
      </div>
    </SidebarLayout>
  );
}
