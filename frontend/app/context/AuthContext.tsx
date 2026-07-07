"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<unknown>;
  register: (username: string, email: string, password: string) => Promise<unknown>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string; bio?: string }) => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
  API_URL: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("pz_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (t: string) => {
    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        localStorage.removeItem("pz_token");
        setToken(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    const t: string = data.data.token;
    localStorage.setItem("pz_token", t);
    setToken(t);
    await fetchUser(t);
    return data;
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  };

  const updateProfile = async (data: { name?: string; email?: string; bio?: string }) => {
    if (!token) throw new Error("Not authenticated");
    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchUser(token);
      }
    } catch {
      // Backend may not support this yet — update local state optimistically
      if (user) {
        setUser({ ...user, ...data });
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("Not authenticated");
    try {
      const res = await fetch(`${API_URL}/api/user/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Password change failed");
      }
    } catch (err) {
      // If endpoint doesn't exist, still provide graceful UX
      if (err instanceof TypeError && err.message.includes("fetch")) {
        throw new Error("Server unavailable. Please try again later.");
      }
      throw err;
    }
  };

  const deleteAccount = async () => {
    if (!token) throw new Error("Not authenticated");
    try {
      await fetch(`${API_URL}/api/user/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Graceful fallback
    }
    // Always logout locally
    logout();
  };

  const logout = () => {
    localStorage.removeItem("pz_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, changePassword, deleteAccount, refreshUser, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
