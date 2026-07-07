"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SidebarLayout from "../components/Sidebar";

function Toggle({ label, desc, storageKey, defaultOn = false }: { label: string; desc?: string; storageKey: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const { addToast } = useToast();
  useEffect(() => { const v = localStorage.getItem(storageKey); if (v !== null) setOn(v === "true"); }, [storageKey]);
  const toggle = () => { const next = !on; setOn(next); localStorage.setItem(storageKey, String(next)); addToast(`${label} ${next ? "enabled" : "disabled"}`, "info"); };
  return (
    <div className="flex items-center justify-between p-2">
      <div><span className="font-body-md text-on-surface text-sm">{label}</span>{desc && <p className="text-xs text-on-surface-variant">{desc}</p>}</div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={on} onChange={toggle} />
        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary-fixed-dim after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const { user, token, loading: authLoading, updateProfile, changePassword, deleteAccount } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("United States");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [tabSize, setTabSize] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [accentColor, setAccentColor] = useState("#00dbe7");

  useEffect(() => { if (!authLoading && !user && !token) router.push("/auth"); }, [user, token, authLoading, router]);
  useEffect(() => { if (user) { setDisplayName(user.name || ""); setUsername(user.name || ""); } }, [user]);

  useEffect(() => {
    const container = document.getElementById("settings-scroll-container");
    if (!container) return;
    const sections = container.querySelectorAll("section");
    const handleScroll = () => { let cur = ""; sections.forEach((s) => { if (container.scrollTop >= (s as HTMLElement).offsetTop - 150) cur = s.id || ""; }); if (cur) setActiveSection(cur); };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const container = document.getElementById("settings-scroll-container");
    const target = document.getElementById(id);
    if (container && target) { container.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" }); setActiveSection(id); }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try { await updateProfile({ name: displayName, bio }); addToast("Profile saved successfully", "success"); } catch { addToast("Failed to save profile", "error"); } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (newPass !== confPass) { addToast("Passwords do not match", "error"); return; }
    if (newPass.length < 6) { addToast("Password must be at least 6 characters", "error"); return; }
    setChangingPass(true);
    try { await changePassword(curPass, newPass); addToast("Password changed successfully", "success"); setCurPass(""); setNewPass(""); setConfPass(""); } catch (e) { addToast(e instanceof Error ? e.message : "Failed to change password", "error"); } finally { setChangingPass(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { addToast("Type DELETE to confirm", "error"); return; }
    await deleteAccount();
    addToast("Account deleted", "info");
    router.push("/");
  };

  if (authLoading) return <SidebarLayout><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner spinner-lg" /></div></SidebarLayout>;

  const NAV = [
    { id: "profile", icon: "person", label: "Profile" },
    { id: "account", icon: "security", label: "Account & Security" },
    { id: "editor", icon: "settings_input_component", label: "Editor Preferences" },
    { id: "notifications", icon: "notifications", label: "Notifications" },
    { id: "appearance", icon: "palette", label: "Appearance" },
    { id: "danger", icon: "report_problem", label: "Danger Zone", isDanger: true },
  ];

  return (
    <SidebarLayout>
      <style dangerouslySetInnerHTML={{ __html: `.glow-cyan:focus-within { box-shadow: 0 0 0 1px #00dbe7, 0 0 8px rgba(0,219,231,0.2); }` }} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#1c1b1b", border: "1px solid rgba(255,180,171,0.3)", borderRadius: 8, padding: 32, maxWidth: 420, width: "90%" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#ffb4ab", marginBottom: 12 }}>Delete Account</h3>
            <p style={{ fontSize: 14, color: "var(--color-on-surface-variant)", marginBottom: 20, lineHeight: 1.6 }}>This action is <strong>permanent</strong> and cannot be undone. Type <code style={{ color: "#ffb4ab", background: "rgba(255,180,171,0.1)", padding: "2px 6px", borderRadius: 3 }}>DELETE</code> to confirm.</p>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" style={{ width: "100%", background: "#131313", border: "1px solid rgba(255,180,171,0.3)", borderRadius: 4, padding: "10px 14px", color: "#ffb4ab", fontFamily: "var(--font-code-block)", fontSize: 14, outline: "none", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }} style={{ padding: "8px 20px", borderRadius: 4, border: "1px solid var(--color-outline-variant)", background: "transparent", color: "var(--color-on-surface-variant)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
              <button onClick={handleDeleteAccount} style={{ padding: "8px 20px", borderRadius: 4, border: "1px solid #ffb4ab", background: deleteConfirm === "DELETE" ? "#ffb4ab" : "transparent", color: deleteConfirm === "DELETE" ? "#131313" : "#ffb4ab", cursor: "pointer", fontWeight: 700, fontSize: 13, opacity: deleteConfirm === "DELETE" ? 1 : 0.5, transition: "all 200ms" }}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden bg-background w-full">
        <aside className="w-64 border-r border-outline-variant overflow-y-auto py-8 hidden lg:flex flex-col flex-shrink-0">
          <div className="px-6 mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Settings</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">v2.4.0-stable</p>
          </div>
          <nav className="flex-1 space-y-1">
            {NAV.map(item => (
              <a key={item.id} href={`#${item.id}`} onClick={e => scrollTo(e, item.id)} className={`flex items-center gap-3 px-6 py-3 transition-all ${activeSection === item.id ? "text-primary-fixed-dim border-l-2 border-primary-fixed-dim bg-primary-container/10" : item.isDanger ? "text-error hover:bg-error/10" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-caps text-label-caps">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main id="settings-scroll-container" className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-16 pb-24">

            {/* Profile */}
            <section id="profile" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-primary-fixed-dim rounded-full" /><h3 className="font-headline-md text-headline-md text-on-surface">Profile</h3></div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-outline-variant group-hover:border-primary-fixed-dim transition-colors flex items-center justify-center bg-surface-container-highest text-4xl font-bold text-primary-container">
                        {user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <button onClick={() => addToast("Avatar upload coming soon", "info")} className="absolute bottom-0 right-0 p-2 bg-primary-fixed-dim text-on-primary rounded-full hover:scale-110 transition-transform shadow-lg">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Avatar (.jpg, .png)</p>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">DISPLAY NAME</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">USERNAME</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" value={username} onChange={e => setUsername(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">BIO</label>
                      <textarea className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">COUNTRY</label>
                        <select className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all outline-none" value={country} onChange={e => setCountry(e.target.value)}>
                          {["United States","Canada","United Kingdom","Germany","Japan","India"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-on-surface-variant block">WEBSITE URL</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-on-surface focus:outline-none glow-cyan transition-all" placeholder="https://github.com/..." value={website} onChange={e => setWebsite(e.target.value)} />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button onClick={handleSaveProfile} disabled={saving} className="px-8 py-2.5 bg-primary-fixed-dim text-on-primary-fixed font-semibold rounded text-sm hover:brightness-110 active:opacity-80 transition-all disabled:opacity-50 disabled:cursor-wait">
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Account & Security */}
            <section id="account" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-secondary-fixed-dim rounded-full" /><h3 className="font-headline-md text-headline-md text-on-surface">Account & Security</h3></div>
              <div className="space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-label-caps text-[11px] text-on-surface-variant">EMAIL ADDRESS</p>
                    <div className="flex items-center gap-3">
                      <span className="font-body-md text-on-surface">{user?.email || "Not set"}</span>
                      <span className="px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary-fixed-dim text-secondary-fixed-dim text-[10px] font-bold">VERIFIED</span>
                    </div>
                  </div>
                  <button onClick={() => addToast("Email change coming soon", "info")} className="text-primary-fixed-dim text-sm font-medium hover:underline">Change</button>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
                  <p className="font-label-caps text-[11px] text-on-surface-variant mb-6">PASSWORD</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="Current Password" type="password" value={curPass} onChange={e => setCurPass(e.target.value)} />
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="New Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                    <input className="bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none focus:border-primary-fixed-dim glow-cyan transition-colors" placeholder="Confirm Password" type="password" value={confPass} onChange={e => setConfPass(e.target.value)} />
                  </div>
                  <button onClick={handleChangePassword} disabled={changingPass || !curPass || !newPass} className="mt-4 px-6 py-2 bg-primary-fixed-dim text-on-primary-fixed font-semibold rounded text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    {changingPass ? "Updating..." : "Update Password"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
                    <Toggle label="Two-Factor Authentication" desc="Secure your account with 2FA." storageKey="pz_2fa" defaultOn />
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
                    <p className="font-label-caps text-[11px] text-on-surface-variant mb-4">ACTIVE SESSIONS</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">laptop_mac</span><span className="text-on-surface">This Device</span></div>
                        <span className="text-primary-container font-bold">Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Editor Preferences */}
            <section id="editor" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-primary-fixed-dim rounded-full" /><h3 className="font-headline-md text-headline-md text-on-surface">Editor Preferences</h3></div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg space-y-10">
                <div>
                  <p className="font-label-caps text-[11px] text-on-surface-variant mb-4">COLOR THEME</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{id:"dark",label:"DARK (Z-DEFAULT)",bg:"bg-background",inner:"bg-surface-container-high",c1:"bg-primary-fixed-dim/40",c2:"bg-on-surface-variant/40"},{id:"light",label:"LIGHT",bg:"bg-white",inner:"bg-gray-100",c1:"bg-blue-500/40",c2:"bg-gray-400/40"},{id:"monokai",label:"MONOKAI",bg:"bg-[#272822]",inner:"bg-[#3e3d32]",c1:"bg-[#f92672]/40",c2:"bg-[#a6e22e]/40"},{id:"dracula",label:"DRACULA",bg:"bg-[#282a36]",inner:"bg-[#44475a]",c1:"bg-[#bd93f9]/40",c2:"bg-[#50fa7b]/40"}].map(t => (
                      <div key={t.id} onClick={() => { setSelectedTheme(t.id); localStorage.setItem("pz_theme", t.id); addToast(`Theme set to ${t.label}`, "success"); }} className={`cursor-pointer ${t.bg} p-2 rounded-lg transition-colors ${selectedTheme === t.id ? "border-2 border-primary-fixed-dim" : "border border-outline-variant hover:border-on-surface-variant"}`}>
                        <div className={`h-12 w-full rounded ${t.inner} flex flex-col p-1.5 gap-1 mb-2`}><div className={`h-1 w-3/4 ${t.c1} rounded`} /><div className={`h-1 w-1/2 ${t.c2} rounded`} /></div>
                        <p className={`text-[10px] font-bold text-center ${selectedTheme === t.id ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>{t.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">FONT SIZE: {fontSize}px</label>
                      <input className="w-full accent-primary-fixed-dim bg-surface-container h-1 rounded-full appearance-none outline-none" max="24" min="10" type="range" value={fontSize} onChange={e => { setFontSize(+e.target.value); localStorage.setItem("pz_fontSize", e.target.value); }} />
                    </div>
                    <div className="space-y-3">
                      <label className="font-label-caps text-[11px] text-on-surface-variant block">TAB SIZE</label>
                      <div className="flex gap-2">
                        {[2,4,8].map(s => (
                          <button key={s} onClick={() => { setTabSize(s); localStorage.setItem("pz_tabSize", String(s)); addToast(`Tab size set to ${s}`, "info"); }} className={`px-4 py-1.5 rounded text-xs font-bold ${tabSize === s ? "border-2 border-primary-fixed-dim bg-primary-container/10 text-primary-fixed-dim" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Toggle label="Auto-complete Suggestions" storageKey="pz_autocomplete" defaultOn />
                    <div className="border-t border-outline-variant/30"><Toggle label="Line Numbers" storageKey="pz_lineNumbers" defaultOn /></div>
                    <div className="border-t border-outline-variant/30"><Toggle label="Word Wrap" storageKey="pz_wordWrap" /></div>
                    <div className="border-t border-outline-variant/30"><Toggle label="Vim Mode" storageKey="pz_vimMode" /></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section id="notifications" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-tertiary-fixed-dim rounded-full" /><h3 className="font-headline-md text-headline-md text-on-surface">Notifications</h3></div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-outline-variant">
                <Toggle label="Contest Reminders" desc="Get notified 30 minutes before a registered contest starts." storageKey="pz_notif_contest" defaultOn />
                <Toggle label="Submission Verdicts" desc="Instant push notifications for your code submission results." storageKey="pz_notif_verdict" defaultOn />
                <Toggle label="Weekly Digest" desc="A summary of your performance and new editorial releases." storageKey="pz_notif_digest" />
                <Toggle label="New Problem Alerts" desc="Be the first to solve newly added problems in the library." storageKey="pz_notif_problems" defaultOn />
              </div>
            </section>

            {/* Appearance */}
            <section id="appearance" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-primary-fixed-dim rounded-full" /><h3 className="font-headline-md text-headline-md text-on-surface">Appearance</h3></div>
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="font-label-caps text-[11px] text-on-surface-variant block">APPLICATION THEME</label>
                    <div className="flex bg-surface-container p-1 rounded border border-outline-variant">
                      {["DARK","LIGHT","SYSTEM"].map(t => (
                        <button key={t} onClick={() => addToast(`Theme: ${t} mode applied`, "success")} className={`flex-1 py-2 text-xs font-bold ${t === "DARK" ? "rounded-sm bg-background border border-outline-variant text-primary-fixed-dim" : "text-on-surface-variant hover:text-on-surface"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="font-label-caps text-[11px] text-on-surface-variant block">UI LANGUAGE</label>
                    <select onChange={() => addToast("Language preference saved", "success")} className="w-full bg-surface-container border border-outline-variant rounded px-4 py-2 text-sm focus:outline-none glow-cyan transition-colors outline-none">
                      {["English (United States)","Simplified Chinese","Russian","Spanish"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="font-label-caps text-[11px] text-on-surface-variant block">ACCENT COLOR</label>
                  <div className="flex flex-wrap gap-4">
                    {["#00dbe7","#bd93f9","#2ae500","#ff9e0b"].map(c => (
                      <button key={c} onClick={() => { setAccentColor(c); addToast("Accent color updated", "success"); }} className="w-10 h-10 rounded-full" style={{ background: c, border: accentColor === c ? "2px solid white" : "1px solid var(--color-outline-variant)", boxShadow: accentColor === c ? `0 0 10px ${c}80` : "none" }} />
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-4">Selected: {accentColor === "#00dbe7" ? "Cyan (Default)" : accentColor}</p>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section id="danger" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8"><div className="h-1 w-8 bg-error rounded-full" /><h3 className="font-headline-md text-headline-md text-error">Danger Zone</h3></div>
              <div className="bg-error-container/5 border border-error/30 p-8 rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="font-body-md text-on-surface font-bold text-lg mb-2">Delete Account</h4>
                    <p className="text-sm text-on-surface-variant max-w-lg">Permanently delete your account and all associated data including problem history, submission logs, and contest points. This action cannot be undone.</p>
                  </div>
                  <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 border border-error text-error hover:bg-error hover:text-on-error font-bold rounded transition-all whitespace-nowrap">Delete Account</button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
