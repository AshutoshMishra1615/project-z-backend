"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  total_submissions: number;
  success_rate: number;
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const key = difficulty.toLowerCase() as DifficultyFilter;
  const cls = key === "easy" ? "badge-easy" : key === "medium" ? "badge-medium" : "badge-hard";
  return (
    <span
      className={cls}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "var(--radius-md)",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "capitalize",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.1em",
      }}
    >
      {difficulty}
    </span>
  );
}

const FILTER_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  easy: { border: "#79ff5b", text: "#79ff5b", bg: "rgba(121,255,91,0.1)" },
  medium: { border: "#00f2ff", text: "#00f2ff", bg: "rgba(0,242,255,0.1)" },
  hard: { border: "#ffb4ab", text: "#ffb4ab", bg: "rgba(255,180,171,0.1)" },
};

export default function ProblemsPage() {
  const { API_URL } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`);
      const data = await res.json();
      setProblems(data.data || []);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = problems.filter((p) => {
    const matchDiff = filter === "all" || p.difficulty.toLowerCase() === filter;
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);
    return matchDiff && matchSearch;
  });

  if (loading) {
    return (
      <SidebarLayout>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "var(--color-text-muted)",
          }}
        >
          <span className="spinner spinner-lg" />
          <p style={{ fontSize: 14, fontFamily: "var(--font-mono)" }}>Loading problems…</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      {/* Search & Filter Bar */}
      <div
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-low)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Search Input */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                fontSize: 20,
              }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 320,
                background: "var(--color-surface-highest)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 14px 8px 40px",
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-primary)",
                outline: "none",
                transition: "border-color 200ms",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#00f2ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          {/* Difficulty Filter Chips */}
          {(["easy", "medium", "hard"] as const).map((diff) => {
            const c = FILTER_COLORS[diff];
            const active = filter === diff;
            return (
              <button
                key={diff}
                onClick={() => setFilter(active ? "all" : diff)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${active ? c.border : "var(--color-border)"}`,
                  color: active ? c.text : "var(--color-text-muted)",
                  background: active ? c.bg : "transparent",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 200ms",
                  textTransform: "capitalize",
                }}
              >
                {diff}
              </button>
            );
          })}

          {/* Count */}
          <div
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-text-muted)",
            }}
          >
            Showing {filtered.length} of {problems.length} problems
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px", background: "#131313" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 100px 100px 80px",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-text-muted)",
              borderBottom: "1px solid var(--color-border)",
              position: "sticky",
              top: 0,
              background: "#131313",
              zIndex: 5,
            }}
          >
            <div>Status</div>
            <div>Title</div>
            <div>Acceptance</div>
            <div>Difficulty</div>
            <div style={{ textAlign: "right" }}>Frequency</div>
          </div>

          {/* Problem Rows */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                color: "var(--color-text-muted)",
                fontSize: 14,
                fontFamily: "var(--font-mono)",
              }}
            >
              No problems found for this filter.
            </div>
          ) : (
            filtered.map((p, i) => {
              const acceptance = p.total_submissions > 0 ? `${p.success_rate.toFixed(1)}%` : "—";
              const freqWidth = p.total_submissions > 0 ? Math.min(100, p.success_rate + 20) : 0;

              return (
                <Link
                  key={p.id}
                  href={`/problems/${p.id}`}
                  className="animate-fade-in card-hover"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 100px 100px 80px",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    background: "#1a1a1a",
                    border: "1px solid #2d2d2d",
                    textDecoration: "none",
                    alignItems: "center",
                    transition: "all 200ms",
                    animationDelay: `${i * 30}ms`,
                  }}
                >
                  {/* Status */}
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 20,
                      color: "var(--color-border)",
                    }}
                  >
                    radio_button_unchecked
                  </span>

                  {/* Title */}
                  <div>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {p.id}. {p.title}
                    </span>
                  </div>

                  {/* Acceptance */}
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {acceptance}
                  </span>

                  {/* Difficulty */}
                  <DifficultyBadge difficulty={p.difficulty} />

                  {/* Frequency Bar */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        width: 64,
                        height: 4,
                        background: "var(--color-surface-highest)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${freqWidth}%`,
                          height: "100%",
                          background: "#00f2ff",
                        }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
