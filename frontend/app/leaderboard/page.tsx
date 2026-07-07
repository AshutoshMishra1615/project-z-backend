"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

type Scope = "Global" | "Contest" | "Friends";
type Timeframe = "All Time" | "This Month" | "This Week";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  solved: number;
  rating: number;
  trend: "up" | "down" | "flat";
  accuracy: number;
  badge: { title: string; color: string; border: string; bg: string };
  region: string;
}

const ALL_USERS: LeaderboardUser[] = [
  { rank: 1, username: "null_ptr", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWsZ2h89VR9OSpSGoqRg_NWCLoe3-KNFX_OCFDssw4CafGHMgb4oxBOVo2kaQR6gnx3dcQcUa-jo0Frd0Nljxa2fMq4ZRAl1uDVMlgRRT2Aqz8hRflNHUYUwU9iiS7IS7h5t3w0LuJFPmUEqPb43cm3Yjlez2OINwQaDc1v2H_G4vZuq0tuvsrPkcIOIo0HKknigJDH3xUwQ4ddgUJXns-CPnM7Z_OdsG4rnwFsRFO1j-FSmK6k4G-GL1ed3XB15-W05Et9ZnWThY", solved: 412, rating: 2840, trend: "up", accuracy: 98.4, badge: { title: "Top Gun", color: "text-primary-container", border: "border-primary-container/30", bg: "bg-primary-container/5" }, region: "🇺🇸" },
  { rank: 2, username: "byte_me", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwVE4GjtH0gsZUkCBJ5gNjVxw7z4HZFIiJgBxIPlVfbNYlcbcglQdnpOYpsnEn1nlAh96P5xJNbUBCT1J82ZcoBnYjpaGwfZfHgagnp3Jzt4F8m4zD-LERM9J9HPj_AL5Q0AvSzZ7YleJPVWdUYuPBBwCmMdRAEOP3LY-mJtLshXd2v8YqM0KWXhNAHhVoFKSDhlhhxIYWCfLrmEwhsGj3WnsQHnvc7xYeJfpJXLiY9kuX0q6gEmXJvyjzCiDDhCroyb9eYZy_esc", solved: 395, rating: 2715, trend: "up", accuracy: 96.2, badge: { title: "Algorithm Master", color: "text-[#C0C0C0]", border: "border-[#C0C0C0]/30", bg: "bg-[#C0C0C0]/5" }, region: "🇬🇧" },
  { rank: 3, username: "stack_ovfl", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiuD6kb0m030LiMOt5MNeTQzwZectRxEL3fVx0-AMQ7Qb688UJAsa4FAlgZP5LOVJVuwP_XvFtL5_OLc8jN7HigVfRFwNXzcQ92dk7MNRN60lgTehOI6e8LSJ4x3CFjfHgZ2LJ-UCfnHnTz7OuHc1U2kEBTubMItZm3krS_9zKwgtnkAVmROR1xooZo5UWuIj1_CHBPjhH_VlgAjUQAWJRLao1OxgzeB7aD2MynBzxLGZWtnM--lBlB0ErCpj_emuC6Egu0U4071w", solved: 388, rating: 2690, trend: "down", accuracy: 95.1, badge: { title: "Optimizer", color: "text-[#CD7F32]", border: "border-[#CD7F32]/30", bg: "bg-[#CD7F32]/5" }, region: "🇨🇦" },
  { rank: 4, username: "coder_x", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9CvA2ywTQD1szNwHsS5LxWj7pHeyGIimeNSTLnWuatLCfobg3cEMfOjDTZVbtc6knm-RThuZk7Pg8_hbSjRNtYiZDeDhUwo0kM117pu3AlTuZLpEewiviMnp4T-u3lq66U8oiu4nHyrYSkPNjZZBu4n2y42MIvcipiXg65f3-UMJY0W3ip0j-rqXXFIDITmNhHaTidwTLlSb-ZK2JDb-tHX4QSLSsLc9bx1XxKhAV92NNnJ953Qgq_VwXL6YIMHq789a6TS2Q2co", solved: 388, rating: 2540, trend: "down", accuracy: 92.0, badge: { title: "Veteran", color: "text-on-surface-variant", border: "border-outline-variant", bg: "bg-surface-container" }, region: "🇩🇪" },
  { rank: 5, username: "void_main", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApX1RjLlyMT0qOGH95KAwp6-jv9ZH2p8KkWh2bzaiALTEMu85sV4fW18IddhOQAOR7o-yP2qAwRfJwD4LudVbzDvgcK0SF-FyS63TSEUfMseziHqnbMD0pvMag3VuITvfwbv07VOllTyUBffFrQ_AljLdBMvPlA7OsQ9YSWX-2YEcL-Xs8qa7LVOaqlrSfmStEtAZyG1jGyH6ALmQO2Vh_TY0uJ9sUQvRHAM0RXuYgo4SPA8jPbsDHDdIeNJ9PgiFCIvyEbmGFaUQ", solved: 376, rating: 2495, trend: "up", accuracy: 89.5, badge: { title: "Speed Demon", color: "text-primary-container", border: "border-primary-container/30", bg: "bg-primary-container/5" }, region: "🇮🇳" },
  { rank: 6, username: "lambda_soul", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjkmz4a16EZXwQcVEDW2whKqFOpXDfLTjEd_yPXu5yDa8qHt_rhIUaQ10CTmYYwKkHb9MekQXIVjpQhXJxnJd2OdAUYRuElX_1PH1-ALn_czBa2vw5TLcdkZT91CPCbBjcyNgPquLYRh5tIhJVIgz4ue0qHCZ5iVzX32EZ3Mn7LTsckRHH14--MzATxCgwlHt-xPe-VK7pUZtgi4-94nZctHoNgPJJn19sdWCQAEDeDZ9IQgQ7xL4dLGzduT-Nkb1I6-7GV0mXVYg", solved: 365, rating: 2410, trend: "up", accuracy: 94.8, badge: { title: "Bug Hunter", color: "text-tertiary-container", border: "border-tertiary-container/30", bg: "bg-tertiary-container/5" }, region: "🇯🇵" },
];

export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>("Global");
  const [timeframe, setTimeframe] = useState<Timeframe>("All Time");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const [animateKey, setAnimateKey] = useState(0);

  // Trigger animation when filters change
  useEffect(() => {
    setAnimateKey(prev => prev + 1);
    const numbers = document.querySelectorAll(".count-up-target");
    numbers.forEach((el) => {
      el.classList.remove("count-up");
      void (el as HTMLElement).offsetWidth; // trigger reflow
      el.classList.add("count-up");
    });
  }, [scope, timeframe, page]);

  // Dummy logic to simulate different data for filters
  const displayUsers = useMemo(() => {
    let list = [...ALL_USERS];
    if (timeframe === "This Month") list = list.map(u => ({ ...u, solved: Math.floor(u.solved * 0.2), rating: u.rating - 200 }));
    if (timeframe === "This Week") list = list.map(u => ({ ...u, solved: Math.floor(u.solved * 0.05), rating: u.rating - 500 }));
    
    if (scope === "Friends") {
      list = list.filter((_, i) => i % 2 === 0); // Mock friends list
    }
    
    // Sort logic to recalculate rank visually if needed
    list.sort((a,b) => b.rating - a.rating);
    return list;
  }, [scope, timeframe]);

  // Extract top 3 for podium
  const top3 = [displayUsers[0], displayUsers[1], displayUsers[2]].filter(Boolean);
  const rest = displayUsers;

  return (
    <SidebarLayout>
      <div className="flex-1 overflow-y-auto terminal-scroll bg-background relative z-0">
        <style dangerouslySetInnerHTML={{ __html: `
          .glow-gold { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.3)); border-color: #FFD700; }
          .glow-silver { filter: drop-shadow(0 0 15px rgba(192, 192, 192, 0.3)); border-color: #C0C0C0; }
          .glow-bronze { filter: drop-shadow(0 0 15px rgba(205, 127, 50, 0.3)); border-color: #CD7F32; }
          .terminal-scroll::-webkit-scrollbar { width: 4px; }
          .terminal-scroll::-webkit-scrollbar-track { background: #0d0d0d; }
          .terminal-scroll::-webkit-scrollbar-thumb { background: #3a494b; border-radius: 2px; }
          .terminal-scroll::-webkit-scrollbar-thumb:hover { background: #00f2ff; }
          @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .count-up { animation: countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ` }} />

        <div className="max-w-6xl mx-auto px-margin-desktop py-8" key={animateKey}>
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed mb-4">LEADERBOARD</h1>
              <div className="flex bg-surface-container rounded p-1 border border-outline-variant/50 w-fit">
                {(["Global", "Contest", "Friends"] as Scope[]).map(s => (
                  <button key={s} onClick={() => setScope(s)} className={`px-6 py-1.5 rounded-sm font-terminal-sm text-terminal-sm transition-colors ${scope === s ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-primary"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {(["All Time", "This Month", "This Week"] as Timeframe[]).map(t => (
                <button key={t} onClick={() => setTimeframe(t)} className={`px-4 py-1 rounded-full border font-terminal-sm text-terminal-sm transition-colors ${timeframe === t ? "border-primary-container/40 text-primary-container bg-primary-container/5" : "border-outline-variant text-on-surface-variant hover:border-primary-container/40"}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Podium Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 mb-16 px-4">
            {/* Rank 2 */}
            {top3[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col items-center glow-silver relative group transition-all hover:scale-105">
                  <div className="absolute -top-6 bg-surface-container border border-outline-variant px-3 py-1 rounded font-terminal-sm text-terminal-sm text-on-surface-variant">RANK 2</div>
                  <div className="w-20 h-20 rounded-full border-2 border-outline-variant mb-4 overflow-hidden p-1">
                    <img alt="Avatar" className="w-full h-full rounded-full object-cover" src={top3[1].avatar}/>
                  </div>
                  <span className="material-symbols-outlined text-outline mb-2">military_tech</span>
                  <div className="font-headline-md text-headline-md text-primary-fixed mb-1">{top3[1].username}</div>
                  <div className="font-terminal-sm text-terminal-sm text-primary-container font-bold count-up-target opacity-0" style={{ animationDelay: "0.1s" }}>{top3[1].rating} PTS</div>
                </div>
              </div>
            )}
            
            {/* Rank 1 */}
            {top3[0] && (
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="w-full bg-surface-container-low border-2 border-primary-container rounded-lg p-8 flex flex-col items-center glow-gold relative z-10 scale-110 transition-all hover:scale-[1.12]">
                  <div className="absolute -top-6 bg-primary-container text-on-primary-container px-4 py-1 rounded font-bold font-terminal-sm text-terminal-sm shadow-[0_0_20px_rgba(0,242,255,0.4)]">CHAMPION</div>
                  <div className="w-24 h-24 rounded-full border-4 border-primary-container mb-4 overflow-hidden p-1 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                    <img alt="Avatar" className="w-full h-full rounded-full object-cover" src={top3[0].avatar}/>
                  </div>
                  <span className="material-symbols-outlined text-[#FFD700] mb-2 scale-150" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
                  <div className="font-headline-lg text-headline-lg text-primary-fixed mb-1">{top3[0].username}</div>
                  <div className="font-terminal-sm text-headline-md text-primary-container font-bold tracking-widest count-up-target opacity-0" style={{ animationDelay: "0s" }}>{top3[0].rating} PTS</div>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div className="order-3 flex flex-col items-center">
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col items-center glow-bronze relative group transition-all hover:scale-105">
                  <div className="absolute -top-6 bg-surface-container border border-outline-variant px-3 py-1 rounded font-terminal-sm text-terminal-sm text-on-surface-variant">RANK 3</div>
                  <div className="w-20 h-20 rounded-full border-2 border-outline-variant mb-4 overflow-hidden p-1">
                    <img alt="Avatar" className="w-full h-full rounded-full object-cover" src={top3[2].avatar}/>
                  </div>
                  <span className="material-symbols-outlined text-[#CD7F32] mb-2">military_tech</span>
                  <div className="font-headline-md text-headline-md text-primary-fixed mb-1">{top3[2].username}</div>
                  <div className="font-terminal-sm text-terminal-sm text-primary-container font-bold count-up-target opacity-0" style={{ animationDelay: "0.2s" }}>{top3[2].rating} PTS</div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden mb-12">
            <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-4 bg-surface-container/50 border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant">
              <div>RANK</div>
              <div>CODER</div>
              <div className="text-right">SOLVED</div>
              <div className="text-right">RATING</div>
              <div className="text-right">ACCURACY</div>
              <div>BADGES</div>
              <div className="text-center">REGION</div>
            </div>
            <div className="divide-y divide-outline-variant/30 font-terminal-sm text-terminal-sm">
              
              {rest.map((u, i) => {
                const isCurrentUser = user && user.name === u.username;
                const r = i + 1; // display rank
                return (
                  <div key={u.username} className={`grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center transition-colors group ${isCurrentUser ? "bg-[#00f2ff10] border-l-4 border-primary-container" : r <= 3 ? "hover:bg-[#00f2ff08]" : "hover:bg-surface-container-high"}`}>
                    <div className={`font-bold count-up-target opacity-0 flex items-center gap-1 ${r <= 3 ? "text-primary-container" : isCurrentUser ? "text-primary-container" : "text-on-surface-variant"}`} style={{ animationDelay: `${0.3 + i*0.05}s` }}>
                      {r <= 3 && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                      {r}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border overflow-hidden ${r <= 3 || isCurrentUser ? "border-primary-container" : "border-outline-variant"}`}>
                        <img alt="Avatar" className="w-full h-full object-cover" src={u.avatar}/>
                      </div>
                      <span className={`font-bold ${isCurrentUser ? "text-primary-container" : "text-on-surface"}`}>{u.username} {isCurrentUser && "(YOU)"}</span>
                    </div>
                    <div className="text-right font-code-block text-code-block count-up-target opacity-0" style={{ animationDelay: `${0.35 + i*0.05}s` }}>{u.solved}</div>
                    <div className="text-right flex items-center justify-end gap-1">
                      <span className="font-code-block text-code-block count-up-target opacity-0" style={{ animationDelay: `${0.4 + i*0.05}s` }}>{u.rating}</span>
                      {u.trend === "up" && <span className="material-symbols-outlined text-green-500 text-sm">arrow_upward</span>}
                      {u.trend === "down" && <span className="material-symbols-outlined text-red-500 text-sm">arrow_downward</span>}
                      {u.trend === "flat" && <span className="material-symbols-outlined text-gray-500 text-sm">horizontal_rule</span>}
                    </div>
                    <div className="text-right text-on-surface-variant">{u.accuracy.toFixed(1)}%</div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-sm border ${u.badge.border} text-[10px] ${u.badge.color} ${u.badge.bg} uppercase`}>{u.badge.title}</span>
                    </div>
                    <div className="text-center text-xl">{u.region}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Pagination */}
          <div className="flex justify-center items-center gap-4 py-8">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all" disabled={page === 1}><span className="material-symbols-outlined">chevron_left</span></button>
            <div className="flex gap-2 font-terminal-sm text-terminal-sm">
              <button onClick={() => setPage(1)} className={`w-10 h-10 flex items-center justify-center border transition-all ${page === 1 ? "border-primary-container text-primary-container bg-primary-container/10" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>1</button>
              <button onClick={() => setPage(2)} className={`w-10 h-10 flex items-center justify-center border transition-all ${page === 2 ? "border-primary-container text-primary-container bg-primary-container/10" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>2</button>
              <button onClick={() => setPage(3)} className={`w-10 h-10 flex items-center justify-center border transition-all ${page === 3 ? "border-primary-container text-primary-container bg-primary-container/10" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>3</button>
              <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant">...</span>
              <button onClick={() => setPage(50)} className={`w-10 h-10 flex items-center justify-center border transition-all ${page === 50 ? "border-primary-container text-primary-container bg-primary-container/10" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>50</button>
            </div>
            <button onClick={() => setPage(page + 1)} className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all" disabled={page === 50}><span className="material-symbols-outlined">chevron_right</span></button>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}
