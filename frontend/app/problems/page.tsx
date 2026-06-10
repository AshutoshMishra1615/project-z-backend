"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

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
        borderRadius: "var(--radius-full)",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "capitalize",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.02em",
      }}
    >
      {difficulty}
    </span>
  );
}

const FILTER_LABELS: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

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
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          color: "var(--color-text-muted)",
        }}
      >
        <span className="spinner spinner-lg" />
        <p style={{ fontSize: 14 }}>Loading problems…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "40px 24px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Problems
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            {problems.length} challenges across all difficulty levels
          </p>
        </div>
      </div>

      {/* Toolbar: filters + search */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTER_LABELS.map(({ value, label }) => {
            const isActive = filter === value;
            const count =
              value === "all"
                ? problems.length
                : problems.filter((p) => p.difficulty.toLowerCase() === value).length;

            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: isActive
                    ? "1px solid rgba(79,70,229,0.5)"
                    : "1px solid var(--color-border)",
                  background: isActive
                    ? "rgba(79,70,229,0.15)"
                    : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  transition: "all 150ms",
                }}
              >
                {label}
                <span
                  style={{
                    padding: "0 5px",
                    borderRadius: "var(--radius-full)",
                    background: isActive
                      ? "rgba(79,70,229,0.25)"
                      : "var(--color-surface-high)",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search problems…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "var(--color-surface-low)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "7px 12px 7px 34px",
              fontSize: 13,
              color: "var(--color-text-primary)",
              outline: "none",
              width: 220,
              transition: "border-color 150ms, box-shadow 150ms",
              fontFamily: "var(--font-sans)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary-container)";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Problem table */}
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
            gridTemplateColumns: "48px 1fr 100px 90px 90px",
            padding: "10px 20px",
            background: "var(--color-surface-low)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {["#", "Title", "Difficulty", "Acceptance", "Submissions"].map((h) => (
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
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            No problems found for this filter.
          </div>
        ) : (
          filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/problems/${p.id}`}
              className="animate-fade-in"
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 100px 90px 90px",
                padding: "14px 20px",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                textDecoration: "none",
                alignItems: "center",
                transition: "background 150ms",
                animationDelay: `${i * 30}ms`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--color-surface-high)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {/* # */}
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p.id}
              </span>

              {/* Title */}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                }}
              >
                {p.title}
              </span>

              {/* Difficulty badge */}
              <div>
                <DifficultyBadge difficulty={p.difficulty} />
              </div>

              {/* Acceptance */}
              <span
                style={{
                  fontSize: 13,
                  color:
                    p.total_submissions > 0
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p.total_submissions > 0 ? `${p.success_rate.toFixed(0)}%` : "—"}
              </span>

              {/* Submissions count */}
              <span
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p.total_submissions > 0 ? p.total_submissions.toLocaleString() : "—"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
