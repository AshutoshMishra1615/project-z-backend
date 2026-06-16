"use client";

import { useEffect, useState } from "react";
import SidebarLayout from "../components/Sidebar";

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [timeRemaining1, setTimeRemaining1] = useState(1 * 3600 + 42 * 60 + 55); // 01:42:55
  const [timeRemaining2, setTimeRemaining2] = useState(12 * 3600 + 4 * 60 + 12); // 12:04:12
  const [timeRemaining3, setTimeRemaining3] = useState(42 * 3600 + 15 * 60 + 0); // 42:15:00
  const [timeRemaining4, setTimeRemaining4] = useState(72 * 3600 + 0 * 60 + 0); // 72:00:00
  const [timeRemaining5, setTimeRemaining5] = useState(5 * 3600 + 22 * 60 + 11); // 05:22:11

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining1((prev) => (prev > 0 ? prev - 1 : 0));
      setTimeRemaining2((prev) => (prev > 0 ? prev - 1 : 0));
      setTimeRemaining3((prev) => (prev > 0 ? prev - 1 : 0));
      setTimeRemaining4((prev) => (prev > 0 ? prev - 1 : 0));
      setTimeRemaining5((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <SidebarLayout>
      <div className="flex-1 overflow-y-auto bg-background relative z-0">
        <style dangerouslySetInnerHTML={{ __html: `
          .card-glow:hover {
              box-shadow: 0 0 15px rgba(0, 242, 255, 0.1);
              transform: translateY(-2px);
              border-color: #00f2ff;
          }
          @keyframes pulse-green {
              0% { box-shadow: 0 0 0 0 rgba(47, 248, 1, 0.4); }
              70% { box-shadow: 0 0 0 6px rgba(47, 248, 1, 0); }
              100% { box-shadow: 0 0 0 0 rgba(47, 248, 1, 0); }
          }
          .pulse-dot {
              animation: pulse-green 2s infinite;
          }
        ` }} />
        
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-container/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-secondary-container/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-margin-desktop py-12">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Contests</h1>
            <p className="text-on-surface-variant font-terminal-sm text-terminal-sm tracking-wider uppercase opacity-70">Compete. Solve. Dominate.</p>
          </header>

          {/* Filters & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant w-fit">
              <button 
                onClick={() => setActiveTab('Upcoming')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Upcoming' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setActiveTab('Active')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Active' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveTab('Past')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Past' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Past
              </button>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
              <span>Sort by:</span>
              <select className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-1.5 focus:border-primary-container focus:ring-0 transition-all text-sm outline-none">
                <option>Date (Soonest)</option>
                <option>Difficulty</option>
                <option>Registrants</option>
              </select>
            </div>
          </div>

          {/* Contests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Active */}
            <div className="bg-surface-container border-l-4 border-l-secondary-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-secondary-container/10 border border-secondary-container/30 px-2 py-1 rounded flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-container pulse-dot"></span>
                  <span className="font-label-caps text-label-caps text-secondary-container">LIVE</span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary-container uppercase">Beginner</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">Weekly Round #42</h3>
                <p className="text-on-surface-variant text-sm">A foundational competition for emerging logic masters.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>2 Hours Remaining</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>1,240 Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Ending In</span>
                <div className="font-code-block text-[24px] text-primary-container tracking-wider">{formatTime(timeRemaining1)}</div>
              </div>
              <button className="w-full mt-auto bg-primary-container text-on-primary font-bold py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all">
                Enter Contest
              </button>
            </div>

            {/* Card 2: Upcoming (Expert) */}
            <div className="bg-surface-container border-l-4 border-l-error border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-primary-container/10 border border-primary-container/30 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-primary-container">UPCOMING</span>
                </div>
                <span className="font-label-caps text-label-caps text-error uppercase">Expert</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">Grand Prix Elite</h3>
                <p className="text-on-surface-variant text-sm">High-stakes algorithmic battle for senior architects.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Duration: 4 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>850 Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Starts In</span>
                <div className="font-code-block text-[24px] text-on-surface tracking-wider">{formatTime(timeRemaining2)}</div>
              </div>
              <button className="w-full mt-auto border border-secondary text-secondary font-bold py-3 rounded-lg hover:bg-secondary/10 active:scale-[0.98] transition-all">
                Register
              </button>
            </div>

            {/* Card 3: Upcoming (Intermediate) */}
            <div className="bg-surface-container border-l-4 border-l-tertiary-fixed-dim border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-primary-container/10 border border-primary-container/30 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-primary-container">UPCOMING</span>
                </div>
                <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase">Intermediate</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">Data Sprint Alpha</h3>
                <p className="text-on-surface-variant text-sm">Optimizing complexity in real-time environments.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Duration: 3 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>2,100 Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Starts In</span>
                <div className="font-code-block text-[24px] text-on-surface tracking-wider">{formatTime(timeRemaining3)}</div>
              </div>
              <button className="w-full mt-auto border border-secondary text-secondary font-bold py-3 rounded-lg hover:bg-secondary/10 active:scale-[0.98] transition-all">
                Register
              </button>
            </div>

            {/* Card 4: Past */}
            <div className="bg-surface-container-lowest border-l-4 border-l-outline border border-outline-variant/30 rounded-lg p-6 flex flex-col gap-4 opacity-75 grayscale-[0.5] hover:grayscale-0 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-outline-variant/20 border border-outline-variant/40 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-outline">ENDED</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-secondary-container uppercase">Beginner</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">Logic Jam v1.0</h3>
                <p className="text-on-surface-variant text-sm">Historical archive of the season opener.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>Finished 2 days ago</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                  <span>Winner: dev_zero_x</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Final Stats</span>
                <div className="text-sm text-on-surface-variant">3,400 participants • 12 problems</div>
              </div>
              <button className="w-full mt-auto border border-outline text-outline font-bold py-3 rounded-lg hover:bg-outline/10 active:scale-[0.98] transition-all">
                View Standings
              </button>
            </div>

            {/* Card 5: Upcoming (Intermediate) */}
            <div className="bg-surface-container border-l-4 border-l-tertiary-fixed-dim border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-primary-container/10 border border-primary-container/30 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-primary-container">UPCOMING</span>
                </div>
                <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase">Intermediate</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">System Design Blitz</h3>
                <p className="text-on-surface-variant text-sm">Scale or fail. Architect for 10M requests per second.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Duration: 5 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>455 Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Starts In</span>
                <div className="font-code-block text-[24px] text-on-surface tracking-wider">{formatTime(timeRemaining4)}</div>
              </div>
              <button className="w-full mt-auto border border-secondary text-secondary font-bold py-3 rounded-lg hover:bg-secondary/10 active:scale-[0.98] transition-all">
                Register
              </button>
            </div>

            {/* Card 6: Upcoming (Beginner) */}
            <div className="bg-surface-container border-l-4 border-l-secondary-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 card-glow transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-primary-container/10 border border-primary-container/30 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-primary-container">UPCOMING</span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary-container uppercase">Beginner</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md text-on-surface">Python Prowess</h3>
                <p className="text-on-surface-variant text-sm">Clean code, fast execution. Mastering syntax.</p>
              </div>
              <div className="flex flex-col gap-2 py-2 border-y border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Duration: 1.5 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>5,200 Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <span className="text-[10px] uppercase text-outline font-label-caps">Starts In</span>
                <div className="font-code-block text-[24px] text-on-surface tracking-wider">{formatTime(timeRemaining5)}</div>
              </div>
              <button className="w-full mt-auto border border-secondary text-secondary font-bold py-3 rounded-lg hover:bg-secondary/10 active:scale-[0.98] transition-all">
                Register
              </button>
            </div>

          </div>

          {/* Empty State Suggestion (Subtle) */}
          <div className="mt-20 p-12 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-60">
            <span className="material-symbols-outlined text-4xl mb-4">terminal</span>
            <h4 className="font-headline-md text-headline-md mb-2">Host your own?</h4>
            <p className="max-w-md text-sm">
              Create private contests for your organization or university. Contact the Project Z enterprise team for custom terminal instances.
            </p>
            <button className="mt-6 text-primary-container font-bold text-sm hover:underline">Learn More →</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
