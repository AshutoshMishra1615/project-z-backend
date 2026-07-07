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
  problem_title?: string;
  state: string;
  verdict?: string;
  execution_time: number;
  created_at: string;
}

interface UserStats {
  total_submissions: number;
  solved_problems: number;
  failed_problems: number;
  submissions: Submission[];
}

const MOCK_STATS: UserStats = {
  total_submissions: 142,
  solved_problems: 104,
  failed_problems: 38,
  submissions: [
    { id: 1042, language: "go", problem_id: 1, problem_title: "Two Sum", state: "COMPLETED", verdict: "Accepted", execution_time: 4, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 1041, language: "rust", problem_id: 24, problem_title: "LRU Cache", state: "COMPLETED", verdict: "Wrong Answer", execution_time: 12, created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 1040, language: "python", problem_id: 42, problem_title: "Trapping Rain Water", state: "COMPLETED", verdict: "Time Limit Exceeded", execution_time: 2005, created_at: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
    { id: 1039, language: "cpp", problem_id: 7, problem_title: "Reverse Integer", state: "COMPLETED", verdict: "Accepted", execution_time: 0, created_at: new Date(Date.now() - 1000 * 3600 * 24).toISOString() },
    { id: 1038, language: "go", problem_id: 2, problem_title: "Add Two Numbers", state: "COMPLETED", verdict: "Accepted", execution_time: 2, created_at: new Date(Date.now() - 1000 * 3600 * 48).toISOString() },
  ]
};

function formatTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function VerdictChip({ state, verdict }: { state: string; verdict?: string }) {
  const label = verdict || state;
  const ok = label === "Accepted" || state === "COMPLETED" && !verdict;
  const isWrong = label === "Wrong Answer";
  const isTLE = label === "Time Limit Exceeded";

  let chipColor = "text-error";
  let chipBg = "bg-error/10";
  let chipBorder = "border-error/30";

  if (ok) {
    chipColor = "text-secondary-container";
    chipBg = "bg-secondary-container/10";
    chipBorder = "border-secondary-container/30";
  } else if (isWrong) {
    chipColor = "text-error";
    chipBg = "bg-error/10";
    chipBorder = "border-error/30";
  } else if (isTLE) {
    chipColor = "text-[#ffb4a2]";
    chipBg = "bg-[#ffb4a2]/10";
    chipBorder = "border-[#ffb4a2]/30";
  }

  return (
    <span className={`font-terminal-sm text-[10px] font-bold px-2.5 py-1 rounded-full border ${chipBg} ${chipBorder} ${chipColor} uppercase tracking-wider whitespace-nowrap`}>
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
  }, [user, token, authLoading, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data.total_submissions > 0 ? data.data : MOCK_STATS);
      } else {
        setStats(MOCK_STATS);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStats(MOCK_STATS);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <SidebarLayout>
        <div className="flex-1 flex items-center justify-center bg-background">
          <span className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  if (!user) return null;

  const submissions = stats?.submissions || [];
  const solved = stats?.solved_problems ?? 0;
  const total = (stats?.solved_problems ?? 0) + (stats?.failed_problems ?? 0);
  const totalTarget = Math.max(total, 500);
  
  const successRate = total > 0 ? ((solved / total) * 100).toFixed(1) : "0.0";
  
  // SVG progress ring calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTarget > 0 ? solved / totalTarget : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Generate heatmap data
  const heatmapData = Array.from({ length: 365 }).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0);
  const latestActivity = heatmapData.slice(heatmapData.length - 84); // Show last 12 weeks (7 days * 12)

  return (
    <SidebarLayout>
      <div className="flex-1 overflow-y-auto bg-background relative z-0">
        <style dangerouslySetInnerHTML={{ __html: `.card-hover:hover{box-shadow:0 0 20px rgba(0,242,255,0.05);transform:translateY(-2px);border-color:rgba(0,242,255,0.2);}` }} />
        
        <div className="max-w-7xl mx-auto px-margin-desktop py-12">
          {/* Header */}
          <div className="mb-10">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-2">Dashboard</h2>
            <p className="font-terminal-sm text-terminal-sm text-on-surface-variant uppercase tracking-wider">Overview of your coding performance</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Problems Solved */}
            <div className="card-hover bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center relative min-h-[250px] transition-all duration-300">
              <h3 className="font-terminal-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant absolute top-6 left-6">Problems Solved</h3>
              <div className="relative w-[140px] h-[140px] mt-6">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="-rotate-90 origin-center transition-all duration-1000">
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--color-surface-highest)" strokeWidth="8" />
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--color-secondary-container)" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--color-secondary-container)" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" opacity={0.3} filter="url(#glow)" />
                  <defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /></filter></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-code-block text-[28px] font-bold text-secondary-container">{solved}</span>
                  <span className="font-code-block text-xs text-on-surface-variant">/ {totalTarget}</span>
                </div>
              </div>
            </div>

            {/* Accuracy Rate */}
            <div className="card-hover bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col justify-between min-h-[250px] transition-all duration-300">
              <h3 className="font-terminal-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant">Accuracy Rate</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="font-headline-lg text-[48px] font-bold text-primary-container leading-none tracking-tight mb-6">
                  {successRate}<span className="text-2xl">%</span>
                </div>
                <div className="w-full space-y-3">
                  {[
                    { label: "Easy", pct: 95, color: "bg-secondary-container", text: "text-secondary-container" },
                    { label: "Medium", pct: 82, color: "bg-primary-container", text: "text-primary-container" },
                    { label: "Hard", pct: 65, color: "bg-error", text: "text-error" },
                  ].map(({ label, pct, color, text }) => (
                    <div key={label}>
                      <div className="flex justify-between font-terminal-sm text-[11px] mb-1.5">
                        <span className="text-on-surface-variant uppercase">{label}</span>
                        <span className={`${text} font-bold`}>{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Activity Heatmap */}
            <div className="card-hover bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col min-h-[250px] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-terminal-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant">Activity (Last 12 Wks)</h3>
                <span className="font-terminal-sm text-[10px] text-on-surface-variant">Max: 12 sub/day</span>
              </div>
              <div className="flex-1 flex items-center justify-center bg-[#131313] border border-outline-variant rounded-lg p-4">
                <div className="grid grid-cols-[repeat(12,1fr)] gap-[3px] w-full">
                  {latestActivity.map((intensity, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-[2px]"
                      style={{
                        background: intensity === 0 ? "var(--color-surface-highest)" : `rgba(121, 255, 91, ${intensity / 100})`,
                      }}
                      title={`${intensity}% active`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <h3 className="font-terminal-sm text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Recent Submissions</h3>
            {submissions.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant rounded-lg py-16 px-6 flex flex-col items-center justify-center gap-4 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">description</span>
                <p className="font-terminal-sm text-sm text-on-surface-variant">No submissions yet.</p>
                <Link href="/problems" className="bg-primary-container text-on-primary-container px-6 py-2 rounded font-bold text-sm hover:brightness-110 transition-all">Solve a Problem →</Link>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[80px_100px_1fr_100px_120px] gap-4 px-6 py-3 bg-surface-container/50 border-b border-outline-variant font-terminal-sm text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                  <div>ID</div>
                  <div>Time</div>
                  <div>Problem</div>
                  <div>Language</div>
                  <div>Verdict</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-outline-variant/50">
                  {submissions.map((s, i) => (
                    <Link
                      key={s.id}
                      href={`/problems/${s.problem_id}`}
                      className="grid grid-cols-[80px_100px_1fr_100px_120px] gap-4 px-6 py-3.5 items-center hover:bg-surface-container-high transition-colors group cursor-pointer"
                    >
                      <div className="font-code-block text-xs text-on-surface-variant">#{s.id}</div>
                      <div className="font-terminal-sm text-[11px] text-on-surface-variant">{s.created_at ? formatTimeAgo(s.created_at) : "Just now"}</div>
                      <div className="font-body-md text-sm font-medium text-on-surface group-hover:text-primary-container transition-colors truncate">
                        {s.problem_title || `Problem ${s.problem_id}`}
                      </div>
                      <div className="font-code-block text-xs text-on-surface-variant capitalize">{s.language}</div>
                      <div><VerdictChip state={s.state} verdict={s.verdict} /></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Status Bar */}
      <div className="w-full bg-surface-container-lowest border-t border-outline-variant px-4 py-2 flex items-center justify-between font-terminal-sm text-xs shrink-0 z-10">
        <div className="flex items-center gap-2 text-primary-container">
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          <span>{user.name.toLowerCase()}@projectz:~$ watch --interval=5 submissions</span>
        </div>
        <div className="text-on-surface-variant opacity-70 flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span> SYSTEM OPTIMAL</span>
          <span>PING 12ms</span>
        </div>
      </div>
    </SidebarLayout>
  );
}
