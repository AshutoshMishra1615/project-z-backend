"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: "code", label: "Problem Set", href: "/problems" },
  { icon: "event", label: "Contests", href: "/contests" },
  { icon: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

const BOTTOM_ITEMS = [
  { icon: "description", label: "Docs", href: "#" },
  { icon: "help", label: "Help", href: "#" },
];

export default function SidebarLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/problems") return pathname.startsWith("/problems");
    if (href === "/contests") return pathname.startsWith("/contests");
    if (href === "/leaderboard") return pathname.startsWith("/leaderboard");
    if (href === "/settings") return pathname.startsWith("/settings");
    if (href === "/dashboard") return pathname === "/dashboard";
    return false;
  };

  return (
    <div className="flex h-full w-full flex-1 overflow-hidden">
      {/* SideNavBar */}
      <aside className="bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant w-64 flex flex-col h-full py-6 shrink-0 hidden md:flex">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-outline-variant overflow-hidden flex items-center justify-center font-bold text-lg text-primary-container uppercase shrink-0">
            {user ? user.name.charAt(0) : "PZ"}
          </div>
          <div>
            <div className="font-label-caps text-label-caps text-primary uppercase">Project Z</div>
            <div className="font-terminal-sm text-terminal-sm text-outline">Code</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 font-terminal-sm text-terminal-sm transition-all cursor-pointer no-underline ${active
                  ? "bg-primary-container/10 text-primary-container border-l-2 border-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1">
          {BOTTOM_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-terminal-sm text-terminal-sm hover:bg-surface-container-highest transition-all cursor-pointer no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
        {children}
      </div>
    </div>
  );
}
