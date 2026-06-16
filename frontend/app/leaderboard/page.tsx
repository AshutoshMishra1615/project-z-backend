"use client";

import { useEffect } from "react";
import SidebarLayout from "../components/Sidebar";

export default function LeaderboardPage() {
  useEffect(() => {
    // Add count-up animation to numbers
    const numbers = document.querySelectorAll(".count-up-target");
    numbers.forEach((el, index) => {
      el.classList.add("count-up");
      (el as HTMLElement).style.animationDelay = `${index * 0.02}s`;
    });
  }, []);

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

        <div className="max-w-6xl mx-auto px-margin-desktop py-8">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed mb-4">LEADERBOARD</h1>
              <div className="flex bg-surface-container rounded p-1 border border-outline-variant/50">
                <button className="px-6 py-1.5 rounded-sm bg-primary-container text-on-primary-container font-terminal-sm text-terminal-sm">Global</button>
                <button className="px-6 py-1.5 rounded-sm text-on-surface-variant font-terminal-sm text-terminal-sm hover:text-primary transition-colors">Contest</button>
                <button className="px-6 py-1.5 rounded-sm text-on-surface-variant font-terminal-sm text-terminal-sm hover:text-primary transition-colors">Friends</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1 rounded-full border border-primary-container/40 text-primary-container bg-primary-container/5 font-terminal-sm text-terminal-sm">All Time</button>
              <button className="px-4 py-1 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary-container/40 transition-colors font-terminal-sm text-terminal-sm">This Month</button>
              <button className="px-4 py-1 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary-container/40 transition-colors font-terminal-sm text-terminal-sm">This Week</button>
            </div>
          </div>

          {/* Podium Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 mb-16 px-4">
            {/* Rank 2 */}
            <div className="order-2 md:order-1 flex flex-col items-center">
              <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col items-center glow-silver relative group transition-all hover:scale-105">
                <div className="absolute -top-6 bg-surface-container border border-outline-variant px-3 py-1 rounded font-terminal-sm text-terminal-sm text-on-surface-variant">RANK 2</div>
                <div className="w-20 h-20 rounded-full border-2 border-outline-variant mb-4 overflow-hidden p-1">
                  <img alt="Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwVE4GjtH0gsZUkCBJ5gNjVxw7z4HZFIiJgBxIPlVfbNYlcbcglQdnpOYpsnEn1nlAh96P5xJNbUBCT1J82ZcoBnYjpaGwfZfHgagnp3Jzt4F8m4zD-LERM9J9HPj_AL5Q0AvSzZ7YleJPVWdUYuPBBwCmMdRAEOP3LY-mJtLshXd2v8YqM0KWXhNAHhVoFKSDhlhhxIYWCfLrmEwhsGj3WnsQHnvc7xYeJfpJXLiY9kuX0q6gEmXJvyjzCiDDhCroyb9eYZy_esc"/>
                </div>
                <span className="material-symbols-outlined text-outline mb-2">military_tech</span>
                <div className="font-headline-md text-headline-md text-primary-fixed mb-1">byte_me</div>
                <div className="font-terminal-sm text-terminal-sm text-primary-container font-bold count-up-target opacity-0">2715 PTS</div>
              </div>
            </div>
            {/* Rank 1 */}
            <div className="order-1 md:order-2 flex flex-col items-center">
              <div className="w-full bg-surface-container-low border-2 border-primary-container rounded-lg p-8 flex flex-col items-center glow-gold relative z-10 scale-110 transition-all hover:scale-[1.12]">
                <div className="absolute -top-6 bg-primary-container text-on-primary-container px-4 py-1 rounded font-bold font-terminal-sm text-terminal-sm shadow-[0_0_20px_rgba(0,242,255,0.4)]">CHAMPION</div>
                <div className="w-24 h-24 rounded-full border-4 border-primary-container mb-4 overflow-hidden p-1 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                  <img alt="Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWsZ2h89VR9OSpSGoqRg_NWCLoe3-KNFX_OCFDssw4CafGHMgb4oxBOVo2kaQR6gnx3dcQcUa-jo0Frd0Nljxa2fMq4ZRAl1uDVMlgRRT2Aqz8hRflNHUYUwU9iiS7IS7h5t3w0LuJFPmUEqPb43cm3Yjlez2OINwQaDc1v2H_G4vZuq0tuvsrPkcIOIo0HKknigJDH3xUwQ4ddgUJXns-CPnM7Z_OdsG4rnwFsRFO1j-FSmK6k4G-GL1ed3XB15-W05Et9ZnWThY"/>
                </div>
                <span className="material-symbols-outlined text-[#FFD700] mb-2 scale-150" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
                <div className="font-headline-lg text-headline-lg text-primary-fixed mb-1">null_ptr</div>
                <div className="font-terminal-sm text-headline-md text-primary-container font-bold tracking-widest count-up-target opacity-0">2840 PTS</div>
              </div>
            </div>
            {/* Rank 3 */}
            <div className="order-3 flex flex-col items-center">
              <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col items-center glow-bronze relative group transition-all hover:scale-105">
                <div className="absolute -top-6 bg-surface-container border border-outline-variant px-3 py-1 rounded font-terminal-sm text-terminal-sm text-on-surface-variant">RANK 3</div>
                <div className="w-20 h-20 rounded-full border-2 border-outline-variant mb-4 overflow-hidden p-1">
                  <img alt="Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiuD6kb0m030LiMOt5MNeTQzwZectRxEL3fVx0-AMQ7Qb688UJAsa4FAlgZP5LOVJVuwP_XvFtL5_OLc8jN7HigVfRFwNXzcQ92dk7MNRN60lgTehOI6e8LSJ4x3CFjfHgZ2LJ-UCfnHnTz7OuHc1U2kEBTubMItZm3krS_9zKwgtnkAVmROR1xooZo5UWuIj1_CHBPjhH_VlgAjUQAWJRLao1OxgzeB7aD2MynBzxLGZWtnM--lBlB0ErCpj_emuC6Egu0U4071w"/>
                </div>
                <span className="material-symbols-outlined text-[#CD7F32] mb-2">military_tech</span>
                <div className="font-headline-md text-headline-md text-primary-fixed mb-1">stack_ovfl</div>
                <div className="font-terminal-sm text-terminal-sm text-primary-container font-bold count-up-target opacity-0">2690 PTS</div>
              </div>
            </div>
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
              
              {/* Top 3 Repeat */}
              <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center hover:bg-[#00f2ff08] transition-colors group">
                <div className="font-bold text-primary-container flex items-center gap-1 count-up-target opacity-0">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 1
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-primary-container overflow-hidden">
                    <img alt="Avatar" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAokSV7QP7Zm24rV5Lpk5TaOv7bMo6lTvOC1Yeinx0ddEr2b7HPIkFnb1ykfMjC0B3fY8BFDs5iZMR2BkMDgiG4-0JIM55sAbb3xDqRbkNyXWA_t7DQqk7cGoPWmA--dYSWiZ_AkL-adizRC30VwZJTtsizzD8y_Hu_A6_t42hPBN4FvqYZyiUEAe0unCjwxBs4Y264BDQAJhBSKskEa3hYmfc-y8uSzlHOUvP9JTNl3Gqa7Tnf8YLlcBY3igRY-euzEPKrMMYUdwg"/>
                  </div>
                  <span className="font-bold text-on-surface">null_ptr</span>
                </div>
                <div className="text-right font-code-block text-code-block count-up-target opacity-0">412</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <span className="font-code-block text-code-block count-up-target opacity-0">2840</span>
                  <span className="material-symbols-outlined text-green-500 text-sm">arrow_upward</span>
                </div>
                <div className="text-right text-on-surface-variant">98.4%</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-sm border border-primary-container/30 text-[10px] text-primary-container bg-primary-container/5 uppercase">Top Gun</span>
                </div>
                <div className="text-center text-xl">🇺🇸</div>
              </div>

              {/* Current User Row */}
              <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center bg-[#00f2ff10] border-l-4 border-primary-container group">
                <div className="font-bold text-primary-container count-up-target opacity-0">42</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-primary-container overflow-hidden">
                    <img alt="Avatar" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd9cx9nuQcIioW2iy15YtdEEDh_-IltR30QVmS-Ev1vq_mlYlUjhP67gQgOSRr2Ha7PrlATvNvl8W39D01d-p76GUEbrMSp2nw0hgz3cWGCKm-B-gYrJSiLL7Br5ZyS4eqXqTj4Ut2KDUIJjEVrkdwrU3jzpkxpNwDaRmtgqAA1G3ppkGokptlHwxjOq23UAaiDQvUPI1wVt6yRjFAHD-gPkpf5ztOdQ_XeeoDgK-Et5Bv3BvnknRfYrHMfjT8pkJTZTOeebUCrLM"/>
                  </div>
                  <span className="font-bold text-primary-container">user_42 (YOU)</span>
                </div>
                <div className="text-right font-code-block text-code-block count-up-target opacity-0">215</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <span className="font-code-block text-code-block count-up-target opacity-0">1840</span>
                  <span className="material-symbols-outlined text-green-500 text-sm">arrow_upward</span>
                </div>
                <div className="text-right text-on-surface-variant">82.1%</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-sm border border-secondary-container/30 text-[10px] text-secondary-container bg-secondary-container/5 uppercase">Rising Star</span>
                </div>
                <div className="text-center text-xl">🇨🇦</div>
              </div>

              {/* Regular Row 1 */}
              <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center hover:bg-surface-container-high transition-colors group">
                <div className="text-on-surface-variant count-up-target opacity-0">4</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden">
                    <img alt="Avatar" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CvA2ywTQD1szNwHsS5LxWj7pHeyGIimeNSTLnWuatLCfobg3cEMfOjDTZVbtc6knm-RThuZk7Pg8_hbSjRNtYiZDeDhUwo0kM117pu3AlTuZLpEewiviMnp4T-u3lq66U8oiu4nHyrYSkPNjZZBu4n2y42MIvcipiXg65f3-UMJY0W3ip0j-rqXXFIDITmNhHaTidwTLlSb-ZK2JDb-tHX4QSLSsLc9bx1XxKhAV92NNnJ953Qgq_VwXL6YIMHq789a6TS2Q2co"/>
                  </div>
                  <span className="text-on-surface">coder_x</span>
                </div>
                <div className="text-right font-code-block text-code-block count-up-target opacity-0">388</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <span className="font-code-block text-code-block count-up-target opacity-0">2540</span>
                  <span className="material-symbols-outlined text-red-500 text-sm">arrow_downward</span>
                </div>
                <div className="text-right text-on-surface-variant">92.0%</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-sm border border-outline-variant text-[10px] text-on-surface-variant bg-surface-container uppercase">Veteran</span>
                </div>
                <div className="text-center text-xl">🇩🇪</div>
              </div>

              {/* Regular Row 2 */}
              <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center hover:bg-surface-container-high transition-colors group">
                <div className="text-on-surface-variant count-up-target opacity-0">5</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden">
                    <img alt="Avatar" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApX1RjLlyMT0qOGH95KAwp6-jv9ZH2p8KkWh2bzaiALTEMu85sV4fW18IddhOQAOR7o-yP2qAwRfJwD4LudVbzDvgcK0SF-FyS63TSEUfMseziHqnbMD0pvMag3VuITvfwbv07VOllTyUBffFrQ_AljLdBMvPlA7OsQ9YSWX-2YEcL-Xs8qa7LVOaqlrSfmStEtAZyG1jGyH6ALmQO2Vh_TY0uJ9sUQvRHAM0RXuYgo4SPA8jPbsDHDdIeNJ9PgiFCIvyEbmGFaUQ"/>
                  </div>
                  <span className="text-on-surface">void_main</span>
                </div>
                <div className="text-right font-code-block text-code-block count-up-target opacity-0">376</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <span className="font-code-block text-code-block count-up-target opacity-0">2495</span>
                  <span className="material-symbols-outlined text-green-500 text-sm">arrow_upward</span>
                </div>
                <div className="text-right text-on-surface-variant">89.5%</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-sm border border-primary-container/30 text-[10px] text-primary-container bg-primary-container/5 uppercase">Speed Demon</span>
                </div>
                <div className="text-center text-xl">🇮🇳</div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-[80px_1fr_120px_150px_120px_200px_100px] gap-4 px-6 py-5 items-center hover:bg-surface-container-high transition-colors group">
                <div className="text-on-surface-variant count-up-target opacity-0">6</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden">
                    <img alt="Avatar" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjkmz4a16EZXwQcVEDW2whKqFOpXDfLTjEd_yPXu5yDa8qHt_rhIUaQ10CTmYYwKkHb9MekQXIVjpQhXJxnJd2OdAUYRuElX_1PH1-ALn_czBa2vw5TLcdkZT91CPCbBjcyNgPquLYRh5tIhJVIgz4ue0qHCZ5iVzX32EZ3Mn7LTsckRHH14--MzATxCgwlHt-xPe-VK7pUZtgi4-94nZctHoNgPJJn19sdWCQAEDeDZ9IQgQ7xL4dLGzduT-Nkb1I6-7GV0mXVYg"/>
                  </div>
                  <span className="text-on-surface">lambda_soul</span>
                </div>
                <div className="text-right font-code-block text-code-block count-up-target opacity-0">365</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <span className="font-code-block text-code-block count-up-target opacity-0">2410</span>
                  <span className="material-symbols-outlined text-green-500 text-sm">arrow_upward</span>
                </div>
                <div className="text-right text-on-surface-variant">94.8%</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-sm border border-tertiary-container/30 text-[10px] text-tertiary-container bg-tertiary-container/5 uppercase">Bug Hunter</span>
                </div>
                <div className="text-center text-xl">🇯🇵</div>
              </div>

            </div>
          </div>

          {/* Footer Pagination-like */}
          <div className="flex justify-center items-center gap-4 py-8">
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary-container transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
            <div className="flex gap-2 font-terminal-sm text-terminal-sm">
              <button className="w-10 h-10 flex items-center justify-center border border-primary-container text-primary-container bg-primary-container/10">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant">...</span>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">50</button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary-container transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}
