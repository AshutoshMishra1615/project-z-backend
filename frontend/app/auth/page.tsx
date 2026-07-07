"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // Reset form when switching tabs
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isLogin]);

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
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        // Note: Backend currently only accepts username, email, password
        await register(username, email, password);
        setSuccess("Account created! You can now sign in.");
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative terminal-grid px-margin-mobile py-12 overflow-hidden min-h-[calc(100vh-64px)]">
      {/* Ambient background shader/effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40"></div>

      {/* Auth Card */}
      <div
        className={`relative z-10 w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-8 auth-card-glow transition-all duration-500 hover:border-primary-container/50 ${
          isLogin ? "max-w-md" : "max-w-[480px]"
        }`}
      >
        {isLogin ? (
          /* LOGIN HEADER */
          <div className="mb-10 text-center">
            <h1 className="font-label-caps text-label-caps tracking-[0.2em] text-primary-container cyan-glow-text mb-2">
              LOGIN_TO_TERMINAL
            </h1>
            <div className="h-1 w-12 bg-primary-container mx-auto"></div>
          </div>
        ) : (
          /* REGISTER HEADER */
          <div className="text-center mb-8">
            <h1 className="font-label-caps text-headline-md text-primary-container cyan-glow-text tracking-widest mb-2">
              REGISTER_NEW_USER
            </h1>
            <p className="font-terminal-sm text-terminal-sm text-on-surface-variant">
              INITIALIZING CREDENTIAL HANDLER...
            </p>
          </div>
        )}

        {/* ALERTS */}
        {error && (
          <div className="mb-6 p-3 rounded bg-error-container/20 border border-error-container/50 text-error font-terminal-sm text-terminal-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 rounded bg-secondary-container/20 border border-secondary-container/50 text-secondary font-terminal-sm text-terminal-sm">
            {success}
          </div>
        )}

        {/* FORM */}
        <form className={isLogin ? "space-y-6" : "space-y-5"} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block font-label-caps text-label-caps text-on-surface-variant ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-terminal-sm text-terminal-sm py-3 px-4 rounded focus:border-primary-container input-focus-glow transition-all placeholder:text-surface-variant outline-none"
                placeholder="e.g. Alan Turing"
                required={!isLogin}
              />
            </div>
          )}

          <div className={!isLogin ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
            <div className="space-y-1.5">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 ml-1">
                {isLogin ? "USER_ID_OR_EMAIL" : "Username"}
              </label>
              <div className="relative">
                {isLogin && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                    person
                  </span>
                )}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-surface-container-low border border-outline-variant text-on-surface font-terminal-sm text-terminal-sm py-3 rounded focus:border-primary-container input-focus-glow transition-all placeholder:text-surface-variant outline-none ${
                    isLogin ? "px-10" : "px-4"
                  }`}
                  placeholder={isLogin ? "admin@project-z.terminal" : "root_01"}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block font-label-caps text-label-caps text-on-surface-variant ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-terminal-sm text-terminal-sm py-3 px-4 rounded focus:border-primary-container input-focus-glow transition-all placeholder:text-surface-variant outline-none"
                  placeholder="user@domain.com"
                  required={!isLogin}
                />
              </div>
            )}
          </div>

          <div className={!isLogin ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label-caps text-label-caps text-on-surface-variant ml-1">
                  {isLogin ? "ACCESS_KEY" : "Password"}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="font-terminal-sm text-terminal-sm text-on-surface-variant/60 hover:text-primary-container transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                {isLogin && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                    lock
                  </span>
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-surface-container-low border border-outline-variant text-on-surface font-terminal-sm text-terminal-sm py-3 rounded focus:border-primary-container input-focus-glow transition-all placeholder:text-surface-variant outline-none ${
                    isLogin ? "px-10" : "px-4"
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block font-label-caps text-label-caps text-on-surface-variant ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-terminal-sm text-terminal-sm py-3 px-4 rounded focus:border-primary-container input-focus-glow transition-all placeholder:text-surface-variant outline-none"
                  placeholder="••••••••"
                  required={!isLogin}
                />
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="flex items-start gap-3 py-2">
              <input className="mt-1" id="tos-check" type="checkbox" required />
              <label
                className="font-terminal-sm text-terminal-sm text-on-surface-variant leading-relaxed"
                htmlFor="tos-check"
              >
                I agree to the{" "}
                <Link href="#" className="text-primary-container hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary-container hover:underline">
                  Code of Conduct
                </Link>
              </label>
            </div>
          )}

          <div className={isLogin ? "pt-2" : "pt-4"}>
            <button
              className={`w-full bg-primary-container text-on-primary-fixed font-bold py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] font-label-caps text-label-caps uppercase ${
                loading ? "opacity-70 cursor-wait" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "PROCESSING..." : isLogin ? "INITIALIZE_SESSION" : "CREATE ACCOUNT"}
            </button>
          </div>
        </form>

        {isLogin && (
          <div className="mt-6">
            <p className="text-center text-[11px] text-on-surface-variant font-terminal-sm">
              Demo admin: <strong className="text-primary-fixed-dim">admin</strong> /{" "}
              <strong className="text-primary-fixed-dim">admin123</strong>
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-outline-variant"></div>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
            {isLogin ? "Or continue with" : "OR REGISTER WITH"}
          </span>
          <div className="flex-grow h-[1px] bg-outline-variant"></div>
        </div>

        {/* Social Logins */}
        {isLogin ? (
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => addToast("GitHub login coming soon", "info")} className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container border border-outline-variant rounded hover:border-primary-container/40 hover:bg-surface-variant/20 transition-all active:scale-95 group cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors">
                terminal
              </span>
              <span className="font-label-caps text-[9px] text-on-surface-variant group-hover:text-primary-container transition-colors">
                GITHUB
              </span>
            </button>
            <button onClick={() => addToast("Google login coming soon", "info")} className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container border border-outline-variant rounded hover:border-primary-container/40 hover:bg-surface-variant/20 transition-all active:scale-95 group cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors">
                shield
              </span>
              <span className="font-label-caps text-[9px] text-on-surface-variant group-hover:text-primary-container transition-colors">
                GOOGLE
              </span>
            </button>
            <button onClick={() => addToast("Discord login coming soon", "info")} className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container border border-outline-variant rounded hover:border-primary-container/40 hover:bg-surface-variant/20 transition-all active:scale-95 group cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors">
                hub
              </span>
              <span className="font-label-caps text-[9px] text-on-surface-variant group-hover:text-primary-container transition-colors">
                DISCORD
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => addToast("GitHub registration coming soon", "info")} className="flex items-center justify-center gap-2 border border-outline-variant py-2.5 rounded font-terminal-sm text-terminal-sm text-on-surface hover:bg-surface-variant/20 transition-all active:scale-95 cursor-pointer">
              <img alt="GitHub Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlPNwTVW-HgdWcLg2CWucV43vPxfvlO7a8PAwTxMjG5lopJxuMaSuI2hGbBOYbNt96quUONT4GlG-gSVUG0WFLVyzMz0lT_vDD8VWB037xNHYaWXwjr1Ee6owklPTu2J-1p4VCd9IN1_zBz7drcoUPYCzfVhd4ZLPEjQnb2qBPW8K0mPamjqdseeO2Qm0Qd-97PlqrjktswyflhkM3Vt8ogHgdiRMfcGGlYcZakD-vGxoj-f-izfyIyR-GO8aY0f7iqQ2Zx_grM20" />
              GitHub
            </button>
            <button onClick={() => addToast("Discord registration coming soon", "info")} className="flex items-center justify-center gap-2 border border-outline-variant py-2.5 rounded font-terminal-sm text-terminal-sm text-on-surface hover:bg-surface-variant/20 transition-all active:scale-95 cursor-pointer">
              <img alt="Discord Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfCijKW7_8eoVU9_RiTW4UN2q7ImtPezR_QRDCTJEGX2EHev6O1k-_Wfr82pOD5Fz5YLvbhZJCKTGB-QyJ2TQXZM__liOEC-UP2jEmp1antCQ-2Yy3Quw46mH6aiC2RTydqRzJPeIiQHSLfEKN_SD8lWU9-WIs4jCRIrr3kpBlV8ReeDPZpzEoD_nOZrNERMvq12rb-VmmVECpiVuSQWvqzISEf3nr4CwLd-eyDUm9CV4--d-nMZaMMaT6yAs182QgVq4CYlymgjY" />
              Discord
            </button>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="font-terminal-sm text-terminal-sm text-on-surface-variant">
            {isLogin ? "New user? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-container font-bold hover:underline decoration-2 underline-offset-4 bg-transparent border-none cursor-pointer p-0"
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      {/* Background Elements (Only on Login to match design) */}
      {isLogin && (
        <>
          <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none hidden lg:block">
            <pre className="font-code-block text-[10px] text-primary-container leading-tight">
              {`SYSTEM_STATUS: ACTIVE\nLATENCY: 14MS\nENCRYPTION: AES-256\nCONNECTION: SECURE`}
            </pre>
          </div>
          <div className="absolute top-20 right-10 opacity-20 pointer-events-none hidden lg:block">
            <div className="w-32 h-32 border-r border-b border-primary-container/30 rounded-br-full"></div>
          </div>
        </>
      )}
    </div>
  );
}
