"use client";

import { useState, useEffect, useRef, use } from "react";
import { useAuth } from "../../context/AuthContext";
import SidebarLayout from "../../components/Sidebar";

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
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "javascript", label: "JavaScript" },
] as const;

type LangValue = (typeof LANGUAGES)[number]["value"];

const TEMPLATES: Record<LangValue, string> = {
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  python: '# Your code here\n\ndef solve():\n    pass\n\nsolve()',
  java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println("Hello")\n}',
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

function diffBadgeStyle(difficulty: string): React.CSSProperties {
  const k = difficulty.toLowerCase();
  if (k === "easy") return { color: "#79ff5b", background: "rgba(121,255,91,0.12)", border: "1px solid rgba(121,255,91,0.25)" };
  if (k === "medium") return { color: "#00dbe7", background: "rgba(0,219,231,0.12)", border: "1px solid rgba(0,219,231,0.25)" };
  return { color: "#ffb4ab", background: "rgba(255,180,171,0.12)", border: "1px solid rgba(255,180,171,0.25)" };
}

/* ─── Component ───────────────────────────────────────────── */
export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token, user, API_URL } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LangValue>("cpp");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "result">("description");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { fetchProblem(); }, [id]);

  const fetchProblem = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems/${id}`);
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
      const res = await fetch(`${API_URL}/api/submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problem_id: parseInt(id), language, code }),
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
        const res = await fetch(`${API_URL}/api/submissions/${ticket}`, {
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
      <SidebarLayout>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="spinner spinner-lg" />
        </div>
      </SidebarLayout>
    );
  }

  if (!problem) {
    return (
      <SidebarLayout>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
          Problem not found
        </div>
      </SidebarLayout>
    );
  }

  const sampleCases = (problem.test_cases || []).filter((tc) => tc.is_sample);
  const ds = diffBadgeStyle(problem.difficulty);
  const isAccepted = submission?.verdict === "Accepted";
  const isPending = submission?.state === "QUEUED" || submission?.state === "RUNNING";
  const codeLines = code.split("\n");

  /* ─── Layout ─────────────────────────────────────────── */
  return (
    <SidebarLayout>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── LEFT: Problem Description ─────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid var(--color-border)",
            overflowY: "auto",
            background: "#131313",
          }}
        >
          {/* Problem header */}
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#00f2ff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {problem.title}
              </h1>
              <button
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 200ms",
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bookmark</span>
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  ...ds,
                }}
              >
                {problem.difficulty}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-muted)" }}>
                Time Limit: 2.0s
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-muted)" }}>
                Memory Limit: 256MB
              </span>
            </div>
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
                    ? "2px solid #00f2ff"
                    : "2px solid transparent",
                  color: activeTab === tab
                    ? "#e1fdff"
                    : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "color 150ms",
                  fontFamily: "var(--font-mono)",
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
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
            {activeTab === "description" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                {problem.description.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**"))
                    return <h3 key={i} style={{ fontSize: 16, fontWeight: 700, color: "#00f2ff", marginTop: 12 }}>{line.replace(/\*\*/g, "")}</h3>;
                  if (line.startsWith("- "))
                    return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>;
                  return <p key={i}>{line || <br />}</p>;
                })}

                {/* Sample test cases */}
                {sampleCases.length > 0 && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#00f2ff" }}>
                      Examples
                    </h3>
                    {sampleCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        style={{
                          background: "var(--color-surface-low)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--color-border)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
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
                              <pre style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e1fdff", background: "var(--color-surface-lowest)", borderRadius: 4, padding: "8px 10px", overflowX: "auto" }}>
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
                    <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.4 }}>description</span>
                    <span style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>Submit your solution to see results here</span>
                  </div>
                ) : submission.error ? (
                  <div style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(255,180,171,0.1)", border: "1px solid rgba(255,180,171,0.25)", color: "#ffb4ab", fontSize: 13 }}>
                    {submission.error}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Verdict banner */}
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "var(--radius-md)",
                        background: isAccepted ? "rgba(121,255,91,0.1)" : isPending ? "var(--color-surface-container)" : "rgba(255,180,171,0.08)",
                        border: `1px solid ${isAccepted ? "rgba(121,255,91,0.3)" : isPending ? "var(--color-border)" : "rgba(255,180,171,0.25)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 800, color: isAccepted ? "#79ff5b" : isPending ? "var(--color-text-primary)" : "#ffb4ab", letterSpacing: "-0.01em" }}>
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
                        { label: "State", val: submission.state },
                        { label: "Stage", val: submission.stage || "—" },
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

        {/* ── RIGHT: Code Editor ──────────────────────────── */}
        <div
          style={{
            flex: 1.5,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-surface-lowest)",
          }}
        >
          {/* Editor Toolbar */}
          <div
            style={{
              height: 48,
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-surface-low)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-text-muted)" }}>
                code_blocks
              </span>
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
                  background: "#131313",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} style={{ background: "var(--color-surface-low)" }}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  transition: "color 200ms",
                }}
                onClick={() => problem && setCode(getTemplate(problem.id, language))}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
              </button>
              <button
                id="submit-code"
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  borderRadius: "var(--radius-md)",
                  background: "#00f2ff",
                  color: "#131313",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting || !code.trim() ? 0.5 : 1,
                  transition: "all 200ms",
                }}
              >
                {submitting ? (
                  <>
                    <span className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                    Submitting…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_arrow</span>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div style={{ position: "relative", flex: 1 }}>
            <div style={{ display: "flex", height: "100%" }}>
              {/* Line numbers */}
              <div
                style={{
                  width: 44,
                  padding: "16px 0",
                  borderRight: "1px solid rgba(58,73,75,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  paddingRight: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  lineHeight: "1.65",
                  color: "rgba(185,202,203,0.3)",
                  userSelect: "none",
                  overflowY: "hidden",
                  flexShrink: 0,
                }}
              >
                {codeLines.map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>

              {/* Textarea */}
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
                  fontSize: 14,
                  lineHeight: "1.65",
                  color: "var(--color-text-primary)",
                  padding: "16px 20px",
                  outline: "none",
                  border: "none",
                  caretColor: "#00f2ff",
                }}
              />
            </div>

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
                  background: "rgba(14, 14, 14, 0.5)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--color-text-muted)" }}>
                  lock
                </span>
                <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>Sign in to submit solutions</p>
                <a href="/auth" className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }}>
                  Sign In
                </a>
              </div>
            )}
          </div>

          {/* Terminal Status Banner */}
          <div
            style={{
              height: 40,
              background: "#001a00",
              borderTop: "1px solid rgba(42, 229, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              flexShrink: 0,
              boxShadow: "0 -2px 10px rgba(42, 229, 0, 0.1)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 16,
                color: "#2ae500",
                marginRight: 8,
                animation: isPending ? "pulse 1.5s infinite" : "none",
              }}
            >
              terminal
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 500,
                color: "#2ae500",
              }}
            >
              {isPending
                ? `RUNNING ${submission?.stage || "TEST CASES"}...`
                : isAccepted
                  ? "ALL TESTS PASSED ✓"
                  : submission?.verdict
                    ? `VERDICT: ${submission.verdict.toUpperCase()}`
                    : "READY FOR SUBMISSION"
              }
            </span>
            {isPending && (
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ae500", animation: "pulse 1.5s infinite" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ae500", animation: "pulse 1.5s 0.5s infinite" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ae500", animation: "pulse 1.5s 1s infinite" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
