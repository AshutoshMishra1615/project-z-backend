"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // In a real app, you might pass query params. 
      // For this demo, we'll just navigate to problems.
      router.push("/problems");
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-background dark:bg-background border-b border-outline-variant w-full h-16 sticky top-0 z-50 shrink-0 flex justify-center">
      <div className="flex justify-between items-center w-full max-w-[1440px] px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-label-caps text-label-caps text-primary-container dark:text-primary-container text-[18px] tracking-widest uppercase no-underline">
            Project Z
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/problems" className="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors duration-200 active:scale-95 no-underline">Problems</Link>
            <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors duration-200 active:scale-95 no-underline">Dashboard</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input 
              className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-sm focus:border-primary-container focus:outline-none transition-all w-64 text-on-surface" 
              placeholder="Search problems..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-on-surface-variant">{user.name}</span>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <button onClick={logout} className="text-on-surface-variant font-medium px-4 py-1.5 border border-outline-variant rounded-lg hover:text-primary-fixed-dim hover:border-primary-fixed-dim transition-all text-sm cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors text-sm no-underline">Login</Link>
              <Link href="/auth" className="bg-primary-container text-on-primary font-bold px-5 py-2 rounded-lg active:scale-95 transition-transform text-sm no-underline">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
