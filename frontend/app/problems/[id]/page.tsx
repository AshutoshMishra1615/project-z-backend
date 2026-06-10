"use client";

import { useState, useEffect, useRef, use } from "react";
import { useAuth } from "../../context/AuthContext";

/* ─── Types ───────────────────────────────────────────────── */
interface TestCase {
  id: number;
  input: string;
  expected_output: string;
  is_sample: boolean;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  total_submissions: number;
  success_rate: number;
  test_cases: TestCase[];
}

interface Submission {
  ticket?: string;
  state: string;
  stage?: string;
  verdict?: string;
  logs?: string;
  execution_time?: number;
  error?: string;
}

/* ─── Constants ───────────────────────────────────────────── */
const LANGUAGES = [
  { value: "cpp",        label: "C++" },
  { value: "python",     label: "Python" },
  { value: "java",       label: "Java" },
  { value: "go",         label: "Go" },
  { value: "javascript", label: "JavaScript" },
] as const;

type LangValue = (typeof LANGUAGES)[number]["value"];

const TEMPLATES: Record<LangValue, string> = {
  cpp:        '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  python:     '# Your code here\n\ndef solve():\n    pass\n\nsolve()',
  java:       'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println("Hello")\n}',
  javascript: '// Your code here\n\nfunction solve() {\n  \n}\n\nsolve();',
};

const LEETCODE_TEMPLATES: Record<number, Partial<Record<LangValue, string>>> = {
  1: {
    cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
    python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass'
  },
  2: {
    cpp: 'class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};',
    python: 'class Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        pass'
  }
};

function getTemplate(problemId: number, lang: LangValue): string {
  if (LEETCODE_TEMPLATES[problemId] && LEETCODE_TEMPLATES[problemId][lang]) {
    return LEETCODE_TEMPLATES[problemId][lang] as string;
  }
  return TEMPLATES[lang];
}

function diffStyle(difficulty: string): React.CSSProperties {
  const k = difficulty.toLowerCase();
  if (k === "easy")   return { color: "#22c55e", background: "rgba(34,197,94,0.12)",  border: "1px solid rgba(34,197,94,0.25)"  };
  if (k === "medium") return { color: "#f59e0b", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" };
  return                     { color: "#ef4444", background: "rgba(239,68,68,0.12)",  border: "1px solid rgba(239,68,68,0.25)"  };
}

/* ─── Component ───────────────────────────────────────────── */
export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token, user, API_URL } = useAuth();

  const [problem, setProblem]       = useState<Problem | null>(null);
  const [loading, setLoading]       = useState(true);
  const [language, setLanguage]     = useState<LangValue>("cpp");
  const [code, setCode]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab]   = useState<"description" | "result">("description");
  const editorRef                   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { fetchProblem(); }, [id]);

  const fetchProblem = async () => {
    try {
      const res  = await fetch(`${API_URL}/api/problems/${id}`);
      const data = await res.json();
      setProblem(data.data);
      setCode(getTemplate(data.data.id, language));
    } catch (err) {
      console.error("Failed to fetch problem:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: LangValue) => {
    setLanguage(lang);
    if (problem) {
      setCode(getTemplate(problem.id, lang));
    } else {
      setCode(TEMPLATES[lang] || "");
    }
  };

  const handleSubmit = async () => {
    if (!token) { alert("Please sign in to submit solutions"); return; }
    setSubmitting(true);
    setSubmission(null);
    try {
      const res  = await fetch(`${API_URL}/api/submissions/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ problem_id: parseInt(id), language, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      const ticket: string = data.data.ticket;
      setSubmission({ ticket, state: "QUEUED", stage: "COMPILING" });
      setActiveTab("result");
      pollSubmission(ticket);
    } catch (err: unknown) {
      setSubmission({ state: "FAILED", error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSubmitting(false);
    }
  };

  const pollSubmission = async (ticket: string) => {
    const maxAttempts = 300;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res  = await fetch(`${API_URL}/api/submissions/${ticket}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) break;
        const sub: Submission = data.data;
        setSubmission(sub);
        if (sub.state === "COMPLETED" || sub.state === "FAILED") break;
      } catch (err) {
        console.error("Poll error:", err);
      }
      await new Promise((r) => setTimeout(r, 800));
    }
  };

  /* ─── Loading / Error states ─────────────────────────── */
  if (loading) {
    return (
      <div style={{ height: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div style={{ height: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
        Problem not found
      </div>
    );
  }

  const sampleCases = (problem.test_cases || []).filter((tc) => tc.is_sample);
  const ds          = diffStyle(problem.difficulty);
  const isAccepted  = submission?.verdict === "Accepted";
  const isPending   = submission?.state === "QUEUED" || submission?.state === "RUNNING";

  /* ─── Layout ─────────────────────────────────────────── */
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: Problem panel ─────────────────────────── */}
      <div
        style={{
          width: "48%",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--color-border)",
          overflowY: "auto",
          background: "var(--color-surface-low)",
        }}
      >
        {/* Problem header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {problem.id}. {problem.title}
            </h1>
            <span
              style={{
                flexShrink: 0,
                padding: "3px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "capitalize",
                fontFamily: "var(--font-mono)",
                ...ds,
              }}
            >
              {problem.difficulty}
            </span>
          </div>
          {problem.total_submissions > 0 && (
            <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>{problem.total_submissions.toLocaleString()} submissions</span>
              <span>·</span>
              <span>{problem.success_rate.toFixed(1)}% acceptance</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)" }}>
          {(["description", "result"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "capitalize",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab
                  ? "2px solid var(--color-primary-container)"
                  : "2px solid transparent",
                color: activeTab === tab
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "color 150ms",
              }}
            >
              {tab}
              {tab === "result" && isPending && (
                <span className="spinner" style={{ width: 11, height: 11, borderWidth: 2 }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {activeTab === "description" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              {problem.description.split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**"))
                  return <h3 key={i} style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 8, letterSpacing: "-0.01em" }}>{line.replace(/\*\*/g, "")}</h3>;
                if (line.startsWith("- "))
                  return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>;
                return <p key={i}>{line || <br />}</p>;
              })}

              {/* Sample test cases */}
              {sampleCases.length > 0 && (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
                    Examples
                  </h3>
                  {sampleCases.map((tc, idx) => (
                    <div
                      key={tc.id}
                      style={{
                        background: "var(--color-surface-container)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--color-border)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                        Example {idx + 1}
                      </div>
                      <div style={{ display: "flex", gap: 0 }}>
                        {[{ label: "Input", val: tc.input }, { label: "Output", val: tc.expected_output }].map(({ label, val }, ci) => (
                          <div
                            key={label}
                            style={{
                              flex: 1,
                              padding: "12px 14px",
                              borderRight: ci === 0 ? "1px solid var(--color-border)" : "none",
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: 6 }}>
                              {label}
                            </span>
                            <pre style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-text-primary)", background: "var(--color-surface-lowest)", borderRadius: 6, padding: "8px 10px", overflowX: "auto" }}>
                              {val}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Result tab */
            <div>
              {!submission ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: "var(--color-text-muted)", gap: 10, textAlign: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span style={{ fontSize: 13 }}>Submit your solution to see results here</span>
                </div>
              ) : submission.error ? (
                <div style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 13 }}>
                  {submission.error}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Verdict banner */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "var(--radius-md)",
                      background: isAccepted ? "rgba(34,197,94,0.1)" : isPending ? "var(--color-surface-container)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${isAccepted ? "rgba(34,197,94,0.3)" : isPending ? "var(--color-border)" : "rgba(239,68,68,0.25)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 800, color: isAccepted ? "#22c55e" : isPending ? "var(--color-text-primary)" : "#ef4444", letterSpacing: "-0.01em" }}>
                      {submission.verdict || submission.state}
                    </span>
                    {isPending && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-muted)" }}>
                        <span className="spinner" style={{ width: 14, height: 14 }} />
                        <span style={{ fontFamily: "var(--font-mono)" }}>{submission.stage}</span>
                      </div>
                    )}
                  </div>

                  {/* Details table */}
                  <div style={{ background: "var(--color-surface-container)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    {[
                      { label: "State",  val: submission.state },
                      { label: "Stage",  val: submission.stage || "—" },
                      { label: "Ticket", val: submission.ticket, mono: true },
                    ].map(({ label, val, mono }, i, arr) => (
                      <div
                        key={label}
                        style={{
                          padding: "11px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
                        }}
                      >
                        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{label}</span>
                        <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontFamily: mono ? "var(--font-mono)" : undefined }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Logs */}
                  {submission.logs && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                        Execution Logs
                      </span>
                      <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "var(--color-surface-lowest)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "12px 14px", overflowX: "auto", color: "var(--color-text-secondary)", maxHeight: 200 }}>
                        {submission.logs}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Code editor ──────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-lowest)",
        }}
      >
        {/* Editor toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            height: 48,
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-low)",
            flexShrink: 0,
          }}
        >
          <select
            id="language-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as LangValue)}
            style={{
              padding: "5px 10px",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              background: "var(--color-surface-container)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 150ms",
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} style={{ background: "var(--color-surface-low)" }}>
                {l.label}
              </option>
            ))}
          </select>

          <button
            id="submit-code"
            onClick={handleSubmit}
            disabled={submitting || !code.trim()}
            className="btn-primary"
            style={{ fontSize: 13, padding: "7px 18px" }}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                Submitting…
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Submit
              </>
            )}
          </button>
        </div>

        {/* Code textarea */}
        <div style={{ position: "relative", flex: 1 }}>
          <textarea
            ref={editorRef}
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here…"
            spellCheck={false}
            style={{
              fontFamily: "var(--font-mono)",
              width: "100%",
              height: "100%",
              resize: "none",
              background: "transparent",
              fontSize: 13,
              lineHeight: 1.65,
              color: "var(--color-text-primary)",
              padding: "20px 24px",
              outline: "none",
              border: "none",
              caretColor: "var(--color-primary-container)",
            }}
          />

          {/* Auth overlay */}
          {!user && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                backdropFilter: "blur(3px)",
                background: "rgba(1, 15, 31, 0.4)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-muted)" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Sign in to submit solutions</p>
              <a href="/auth" className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }}>
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
