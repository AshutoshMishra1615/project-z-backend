"use client";

import { useEffect, useState } from "react";
import SidebarLayout from "../components/Sidebar";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const container = document.getElementById("settings-scroll-container");
    if (!container) return;

    const sections = document.querySelectorAll("main section");

    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (container.scrollTop >= sectionTop - 150) {
          current = section.getAttribute("id") || "";
        }
      });
      if (current) setActiveSection(current);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const container = document.getElementById("settings-scroll-container");
    const target = document.getElementById(id);
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <SidebarLayout>
      <style dangerouslySetInnerHTML={{
        __html: `
          .glow-cyan:focus-within {
              box-shadow: 0 0 0 1px #00dbe7, 0 0 8px rgba(0, 219, 231, 0.2);
          }
        `
      }} />
      <div className="flex flex-1 overflow-hidden bg-background w-full">
        {/* Settings Inner Sidebar */}
        <aside className="w-64 border-r border-outline-variant overflow-y-auto py-8 hidden lg:flex flex-col flex-shrink-0">
          <div className="px-6 mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Settings</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">v2.4.0-stable</p>
          </div>
          <nav className="flex-1 space-y-1">
            {[
              { id: "profile", icon: "person", label: "Profile" },
              { id: "account", icon: "security", label: "Account & Security" },
              { id: "editor", icon: "settings_input_component", label: "Editor Preferences" },
              { id: "notifications", icon: "notifications", label: "Notifications" },
              { id: "appearance", icon: "palette", label: "Appearance" },
              { id: "danger", icon: "report_problem", label: "Danger Zone", isDanger: true },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`flex items-center gap-3 px-6 py-3 transition-all ${
                    isActive
                      ? "text-primary-fixed-dim border-l-2 border-primary-fixed-dim bg-primary-container/10"
                      : item.isDanger
                      ? "text-error hover:bg-error/10 hover:text-error"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-caps text-label-caps">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main id="settings-scroll-container" className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-16 pb-24">
            
            {/* Section: Profile */}
            <section id="profile" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-primary-fixed-dim rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Profile</h3>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-outline-variant group-hover:border-primary-fixed-dim transition-colors">
                        <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBexx83bVcY_V4y5Rp9NjKzZewtaWQF-LNtb9XJxStnqS8OCM7W1suM0_UZfpZ3P2DlyT08zG-98lYmpA3AXliuz9bHoN7zvG4ZYTKQv_1HF2BYZyuEONCaKrc0Mbk6S_diJwXMfmKnLPJIlnLamEHQqBsqfGJE7Ejj_cVv-1iUxtvJKK4frxBpcGdcAYWJ8RFGTB9aq8M4Uf6l8h17tSRz8314gMlSQFGI6X0Iyk0W4pB1fsYWSNnzto-BNM3WrYsTsanFVdbKh_I"/>
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-primary-fixed-dim text-on-primary rounded-full hover:scale-110 transition-transform shadow-lg">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Avatar (.jpg, .png)</p>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">DISPLAY NAME</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" type="text" defaultValue="Neo Hacker"/>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">USERNAME</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" type="text" defaultValue="neohacker_z"/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">BIO</label>
                      <textarea className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" rows={3} defaultValue="Senior developer focusing on competitive programming and system architecture. Always looking for the most optimized O(n log n) solution."></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">COUNTRY</label>
                        <select className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all outline-none">
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Germany</option>
                          <option>Japan</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">WEBSITE URL</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" placeholder="https://github.com/..." type="url"/>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="px-8 py-2.5 bg-primary-fixed-dim text-on-primary-fixed font-semibold rounded text-sm hover:brightness-110 active:opacity-80 transition-all shadow-glow">Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Account & Security */}
            <section id="account" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-secondary-fixed-dim rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Account & Security</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-label-caps text-[11px] text-on-surface-variant">EMAIL ADDRESS</p>
                    <div className="flex items-center gap-3">
                      <span className="font-body-md text-on-surface">neo.hacker@proton.me</span>
                      <span className="px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary-fixed-dim text-secondary-fixed-dim text-[10px] font-bold">VERIFIED</span>
                    </div>
                  </div>
                  <button className="text-primary-fixed-dim text-sm font-medium hover:underline">Change</button>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
                  <p className="font-label-caps text-[11px] text-on-surface-variant mb-6">PASSWORD</p>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="Current Password" type="password"/>
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="New Password" type="password"/>
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="Confirm Password" type="password"/>
                  </form>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-body-md text-on-surface font-semibold">Two-Factor Authentication</p>
                      <p className="text-xs text-on-surface-variant">Secure your account with 2FA.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-fixed-dim"></div>
                    </label>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
                    <p className="font-label-caps text-[11px] text-on-surface-variant mb-4">ACTIVE SESSIONS</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">laptop_mac</span>
                          <span className="text-on-surface">MacOS • Chrome (London, UK)</span>
                        </div>
                        <span className="text-on-surface-variant">Current</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">smartphone</span>
                          <span className="text-on-surface">iPhone 15 • Safari (Paris, FR)</span>
                        </div>
                        <button className="text-error hover:underline">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Editor Preferences */}
            <section id="editor" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-primary-fixed-dim rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Editor Preferences</h3>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg space-y-10">
                <div>
                  <p className="font-label-caps text-[11px] text-on-surface-variant mb-4">COLOR THEME</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="cursor-pointer border-2 border-primary-fixed-dim bg-background p-2 rounded-lg group">
                      <div className="h-12 w-full rounded bg-surface-container-high flex flex-col p-1.5 gap-1 mb-2">
                        <div className="h-1 w-3/4 bg-primary-fixed-dim/40 rounded"></div>
                        <div className="h-1 w-1/2 bg-on-surface-variant/40 rounded"></div>
                      </div>
                      <p className="text-[10px] font-bold text-center text-primary-fixed-dim">DARK (Z-DEFAULT)</p>
                    </div>
                    <div className="cursor-pointer border border-outline-variant bg-white p-2 rounded-lg hover:border-on-surface-variant transition-colors">
                      <div className="h-12 w-full rounded bg-gray-100 flex flex-col p-1.5 gap-1 mb-2">
                        <div className="h-1 w-3/4 bg-blue-500/40 rounded"></div>
                        <div className="h-1 w-1/2 bg-gray-400/40 rounded"></div>
                      </div>
                      <p className="text-[10px] font-bold text-center text-on-surface-variant">LIGHT</p>
                    </div>
                    <div className="cursor-pointer border border-outline-variant bg-[#272822] p-2 rounded-lg hover:border-on-surface-variant transition-colors">
                      <div className="h-12 w-full rounded bg-[#3e3d32] flex flex-col p-1.5 gap-1 mb-2">
                        <div className="h-1 w-3/4 bg-[#f92672]/40 rounded"></div>
                        <div className="h-1 w-1/2 bg-[#a6e22e]/40 rounded"></div>
                      </div>
                      <p className="text-[10px] font-bold text-center text-on-surface-variant">MONOKAI</p>
                    </div>
                    <div className="cursor-pointer border border-outline-variant bg-[#282a36] p-2 rounded-lg hover:border-on-surface-variant transition-colors">
                      <div className="h-12 w-full rounded bg-[#44475a] flex flex-col p-1.5 gap-1 mb-2">
                        <div className="h-1 w-3/4 bg-[#bd93f9]/40 rounded"></div>
                        <div className="h-1 w-1/2 bg-[#50fa7b]/40 rounded"></div>
                      </div>
                      <p className="text-[10px] font-bold text-center text-on-surface-variant">DRACULA</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">FONT SIZE: 14px</label>
                      <input className="w-full accent-primary-fixed-dim bg-surface-container h-1 rounded-full appearance-none outline-none" max="24" min="10" type="range" defaultValue="14"/>
                    </div>
                    <div className="space-y-3">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">FONT FAMILY</label>
                      <select className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm font-code-block outline-none glow-cyan transition-colors">
                        <option>{"'JetBrains Mono', monospace"}</option>
                        <option>{"'Fira Code', monospace"}</option>
                        <option>{"'Source Code Pro', monospace"}</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">TAB SIZE</label>
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 border-2 border-primary-fixed-dim bg-primary-container/10 rounded text-xs font-bold text-primary-fixed-dim">2</button>
                        <button className="px-4 py-1.5 border border-outline-variant rounded text-xs font-bold text-on-surface-variant hover:bg-surface-container-high">4</button>
                        <button className="px-4 py-1.5 border border-outline-variant rounded text-xs font-bold text-on-surface-variant hover:bg-surface-container-high">8</button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2">
                      <span className="font-body-md text-on-surface text-sm">Auto-complete Suggestions</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-outline-variant/30">
                      <span className="font-body-md text-on-surface text-sm">Line Numbers</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-outline-variant/30">
                      <span className="font-body-md text-on-surface text-sm">Word Wrap</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-outline-variant/30">
                      <span className="font-body-md text-on-surface text-sm">Vim Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Notifications */}
            <section id="notifications" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-tertiary-fixed-dim rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Notifications</h3>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-outline-variant">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-on-surface font-semibold">Contest Reminders</p>
                    <p className="text-xs text-on-surface-variant">Get notified 30 minutes before a registered contest starts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-on-surface font-semibold">Submission Verdicts</p>
                    <p className="text-xs text-on-surface-variant">Instant push notifications for your code submission results.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-on-surface font-semibold">Weekly Digest</p>
                    <p className="text-xs text-on-surface-variant">A summary of your performance and new editorial releases.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-on-surface font-semibold">New Problem Alerts</p>
                    <p className="text-xs text-on-surface-variant">Be the first to solve newly added problems in the library.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Section: Appearance */}
            <section id="appearance" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-primary-fixed-dim rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Appearance</h3>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="font-label-caps text-[11px] text-on-surface-variant block">APPLICATION THEME</label>
                    <div className="flex bg-surface-container p-1 rounded border border-outline-variant">
                      <button className="flex-1 py-2 text-xs font-bold rounded-sm bg-background border border-outline-variant text-primary-fixed-dim">DARK</button>
                      <button className="flex-1 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface">LIGHT</button>
                      <button className="flex-1 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface">SYSTEM</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="font-label-caps text-[11px] text-on-surface-variant block">UI LANGUAGE</label>
                    <select className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none glow-cyan transition-colors outline-none">
                      <option>English (United States)</option>
                      <option>Simplified Chinese</option>
                      <option>Russian</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="font-label-caps text-[11px] text-on-surface-variant block">ACCENT COLOR</label>
                  <div className="flex flex-wrap gap-4">
                    <button className="w-10 h-10 rounded-full bg-[#00dbe7] border-2 border-white shadow-[0_0_10px_rgba(0,219,231,0.5)]"></button>
                    <button className="w-10 h-10 rounded-full bg-[#bd93f9] border border-outline-variant"></button>
                    <button className="w-10 h-10 rounded-full bg-[#2ae500] border border-outline-variant"></button>
                    <button className="w-10 h-10 rounded-full bg-[#ff9e0b] border border-outline-variant"></button>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-4">Selected: Cyan (System Default)</p>
                </div>
              </div>
            </section>

            {/* Section: Danger Zone */}
            <section id="danger" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-error rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-error">Danger Zone</h3>
              </div>
              <div className="bg-error-container/5 border border-error/30 p-8 rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="font-body-md text-on-surface font-bold text-lg mb-2">Delete Account</h4>
                    <p className="text-sm text-on-surface-variant max-w-lg">
                      Permanently delete your account and all associated data including problem history, submission logs, and contest points. This action cannot be undone.
                    </p>
                  </div>
                  <button className="px-6 py-2.5 border border-error text-error hover:bg-error hover:text-on-error font-bold rounded transition-all whitespace-nowrap">
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
