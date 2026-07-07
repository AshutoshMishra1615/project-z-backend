"use client";

import { useEffect, useState, useMemo } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

type Tab = "Upcoming" | "Active" | "Past";
type SortKey = "date" | "difficulty" | "registrants";
type Difficulty = "beginner" | "intermediate" | "expert";

interface Contest {
  id: number; title: string; desc: string; tab: Tab; difficulty: Difficulty;
  duration?: string; registered: number; timeLeft: number;
  winner?: string; participants?: number; problems?: number;
}

const INITIAL_CONTESTS: Contest[] = [
  { id: 1, title: "Weekly Round #42", desc: "A foundational competition for emerging logic masters.", tab: "Active", difficulty: "beginner", duration: "2 Hours Remaining", registered: 1240, timeLeft: 1*3600+42*60+55 },
  { id: 2, title: "Grand Prix Elite", desc: "High-stakes algorithmic battle for senior architects.", tab: "Upcoming", difficulty: "expert", duration: "Duration: 4 Hours", registered: 850, timeLeft: 12*3600+4*60+12 },
  { id: 3, title: "Data Sprint Alpha", desc: "Optimizing complexity in real-time environments.", tab: "Upcoming", difficulty: "intermediate", duration: "Duration: 3 Hours", registered: 2100, timeLeft: 42*3600+15*60 },
  { id: 4, title: "Logic Jam v1.0", desc: "Historical archive of the season opener.", tab: "Past", difficulty: "beginner", timeLeft: 0, registered: 0, winner: "dev_zero_x", participants: 3400, problems: 12 },
  { id: 5, title: "System Design Blitz", desc: "Scale or fail. Architect for 10M requests per second.", tab: "Upcoming", difficulty: "intermediate", duration: "Duration: 5 Hours", registered: 455, timeLeft: 72*3600 },
  { id: 6, title: "Python Prowess", desc: "Clean code, fast execution. Mastering syntax.", tab: "Upcoming", difficulty: "beginner", duration: "Duration: 1.5 Hours", registered: 5200, timeLeft: 5*3600+22*60+11 },
];

const DIFF_COLORS: Record<Difficulty, { border: string; text: string }> = {
  beginner: { border: "border-l-secondary-container", text: "text-secondary-container" },
  intermediate: { border: "border-l-tertiary-fixed-dim", text: "text-tertiary-fixed-dim" },
  expert: { border: "border-l-error", text: "text-error" },
};

const DIFF_ORDER: Record<Difficulty, number> = { beginner: 0, intermediate: 1, expert: 2 };

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [contests, setContests] = useState(INITIAL_CONTESTS);
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set());
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setContests(prev => prev.map(c => ({ ...c, timeLeft: Math.max(0, c.timeLeft - 1) })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s/3600).toString().padStart(2,"0");
    const m = Math.floor((s%3600)/60).toString().padStart(2,"0");
    const sec = (s%60).toString().padStart(2,"0");
    return `${h}:${m}:${sec}`;
  };

  const filtered = useMemo(() => {
    let list = contests.filter(c => c.tab === activeTab);
    if (sortBy === "date") list.sort((a,b) => a.timeLeft - b.timeLeft);
    else if (sortBy === "difficulty") list.sort((a,b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
    else list.sort((a,b) => b.registered - a.registered);
    return list;
  }, [contests, activeTab, sortBy]);

  const handleRegister = (c: Contest) => {
    if (!user) { addToast("Please sign in to register for contests", "error"); return; }
    if (registeredIds.has(c.id)) { addToast(`Already registered for ${c.title}`, "info"); return; }
    setRegisteredIds(prev => new Set(prev).add(c.id));
    addToast(`Registered for ${c.title}!`, "success");
  };

  const handleEnter = (c: Contest) => {
    if (!user) { addToast("Please sign in to enter contests", "error"); return; }
    addToast(`Entering ${c.title}... Loading problems`, "info");
  };

  return (
    <SidebarLayout>
      <div className="flex-1 overflow-y-auto bg-background relative z-0">
        <style dangerouslySetInnerHTML={{ __html: `.card-glow:hover{box-shadow:0 0 15px rgba(0,242,255,0.1);transform:translateY(-2px);border-color:#00f2ff;}@keyframes pulse-green{0%{box-shadow:0 0 0 0 rgba(47,248,1,0.4);}70%{box-shadow:0 0 0 6px rgba(47,248,1,0);}100%{box-shadow:0 0 0 0 rgba(47,248,1,0);}}.pulse-dot{animation:pulse-green 2s infinite;}` }} />
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-container/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-secondary-container/5 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-[1200px] mx-auto px-margin-desktop py-12">
          <header className="mb-10">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Contests</h1>
            <p className="text-on-surface-variant font-terminal-sm text-terminal-sm tracking-wider uppercase opacity-70">Compete. Solve. Dominate.</p>
          </header>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant w-fit">
              {(["Upcoming","Active","Past"] as Tab[]).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>{t}</button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
              <span>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-1.5 focus:border-primary-container focus:ring-0 transition-all text-sm outline-none">
                <option value="date">Date (Soonest)</option>
                <option value="difficulty">Difficulty</option>
                <option value="registrants">Registrants</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-4 block opacity-40">event_busy</span>
              <p className="font-terminal-sm text-terminal-sm">No {activeTab.toLowerCase()} contests found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(c => {
                const dc = DIFF_COLORS[c.difficulty];
                const isPast = c.tab === "Past";
                const isLive = c.tab === "Active";
                const isRegistered = registeredIds.has(c.id);
                return (
                  <div key={c.id} className={`${isPast ? "bg-surface-container-lowest opacity-75 grayscale-[0.5] hover:grayscale-0" : "bg-surface-container"} border-l-4 ${isPast ? "border-l-outline" : dc.border} border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300`}>
                    <div className="flex justify-between items-start">
                      <div className={`${isLive ? "bg-secondary-container/10 border-secondary-container/30" : isPast ? "bg-outline-variant/20 border-outline-variant/40" : "bg-primary-container/10 border-primary-container/30"} border px-2 py-1 rounded flex items-center gap-2`}>
                        {isLive && <span className="w-2 h-2 rounded-full bg-secondary-container pulse-dot" />}
                        <span className={`font-label-caps text-label-caps ${isLive ? "text-secondary-container" : isPast ? "text-outline" : "text-primary-container"}`}>{isLive ? "LIVE" : isPast ? "ENDED" : "UPCOMING"}</span>
                      </div>
                      <span className={`font-label-caps text-label-caps uppercase ${isPast ? "text-on-secondary-container" : dc.text}`}>{c.difficulty}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface">{c.title}</h3>
                      <p className="text-on-surface-variant text-sm">{c.desc}</p>
                    </div>
                    <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                      {isPast ? (<>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-[18px]">history</span><span>Finished 2 days ago</span></div>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-[18px]">emoji_events</span><span>Winner: {c.winner}</span></div>
                      </>) : (<>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-[18px]">schedule</span><span>{c.duration}</span></div>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-[18px]">group</span><span>{c.registered.toLocaleString()} Registered</span></div>
                      </>)}
                    </div>
                    <div className="flex flex-col gap-1 py-2">
                      <span className="text-[10px] uppercase text-outline font-label-caps">{isPast ? "Final Stats" : isLive ? "Ending In" : "Starts In"}</span>
                      {isPast ? (
                        <div className="text-sm text-on-surface-variant">{c.participants?.toLocaleString()} participants • {c.problems} problems</div>
                      ) : (
                        <div className={`font-code-block text-[24px] tracking-wider ${isLive ? "text-primary-container" : "text-on-surface"}`}>{fmt(c.timeLeft)}</div>
                      )}
                    </div>
                    {isLive ? (
                      <button onClick={() => handleEnter(c)} className="w-full mt-auto bg-primary-container text-on-primary font-bold py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all">Enter Contest</button>
                    ) : isPast ? (
                      <button onClick={() => addToast(`Viewing standings for ${c.title}`, "info")} className="w-full mt-auto border border-outline text-outline font-bold py-3 rounded-lg hover:bg-outline/10 active:scale-[0.98] transition-all">View Standings</button>
                    ) : (
                      <button onClick={() => handleRegister(c)} className={`w-full mt-auto font-bold py-3 rounded-lg active:scale-[0.98] transition-all ${isRegistered ? "bg-secondary-container/20 border border-secondary-container text-secondary-container" : "border border-secondary text-secondary hover:bg-secondary/10"}`}>
                        {isRegistered ? "✓ Registered" : "Register"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-20 p-12 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-60">
            <span className="material-symbols-outlined text-4xl mb-4">terminal</span>
            <h4 className="font-headline-md text-headline-md mb-2">Host your own?</h4>
            <p className="max-w-md text-sm">Create private contests for your organization or university. Contact the Project Z enterprise team for custom terminal instances.</p>
            <button onClick={() => addToast("Enterprise inquiry form coming soon", "info")} className="mt-6 text-primary-container font-bold text-sm hover:underline">Learn More →</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
