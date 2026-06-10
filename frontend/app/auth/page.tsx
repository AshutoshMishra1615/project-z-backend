"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        router.push("/problems");
      } else {
        await register(username, email, password);
        setSuccess("Account created! You can now sign in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-md p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e8e8f0]">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-[#9898b0]">
            {isLogin
              ? "Sign in to submit solutions and track progress"
              : "Join Project Z and start solving challenges"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1">
          {[{ label: "Sign In", value: true }, { label: "Register", value: false }].map((tab) => (
            <button
              key={tab.label}
              onClick={() => switchTab(tab.value)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer border-none
                ${isLogin === tab.value
                  ? "bg-[#4f46e5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
                  : "bg-transparent text-[#9898b0] hover:text-[#e8e8f0]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.2)] text-[#ff5252] text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.2)] text-[#00e676] text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06]
                         text-[#e8e8f0] text-sm placeholder-[#5e5e78] outline-none
                         focus:border-[#6c63ff] focus:ring-2 focus:ring-[rgba(108,99,255,0.15)]
                         transition-all duration-150"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              id="auth-username"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06]
                           text-[#e8e8f0] text-sm placeholder-[#5e5e78] outline-none
                           focus:border-[#6c63ff] focus:ring-2 focus:ring-[rgba(108,99,255,0.15)]
                           transition-all duration-150"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="auth-email"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06]
                         text-[#e8e8f0] text-sm placeholder-[#5e5e78] outline-none
                         focus:border-[#6c63ff] focus:ring-2 focus:ring-[rgba(108,99,255,0.15)]
                         transition-all duration-150"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="auth-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="auth-submit"
            className="mt-2 w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none
                       bg-[#4f46e5] hover:bg-[#4338ca]
                       shadow-[0_4px_15px_rgba(79,70,229,0.25)]
                       hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-px
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="spinner" style={{ width: 18, height: 18 }} />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {isLogin && (
          <p className="text-center text-xs text-[#5e5e78]">
            Demo admin:{" "}
            <strong className="text-[#9898b0]">admin</strong> /{" "}
            <strong className="text-[#9898b0]">admin123</strong>
          </p>
        )}
      </div>
    </div>
  );
}
