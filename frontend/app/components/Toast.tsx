"use client";

import { useEffect, useState } from "react";
import { useToast, ToastType } from "../context/ToastContext";

const ICONS: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: "rgba(121, 255, 91, 0.08)",
    border: "rgba(121, 255, 91, 0.3)",
    text: "#79ff5b",
    icon: "#79ff5b",
  },
  error: {
    bg: "rgba(255, 180, 171, 0.08)",
    border: "rgba(255, 180, 171, 0.3)",
    text: "#ffb4ab",
    icon: "#ffb4ab",
  },
  info: {
    bg: "rgba(0, 242, 255, 0.08)",
    border: "rgba(0, 242, 255, 0.3)",
    text: "#00f2ff",
    icon: "#00f2ff",
  },
};

function ToastItem({
  id,
  message,
  type,
  onRemove,
}: {
  id: string;
  message: string;
  type: ToastType;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "var(--radius-lg)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "var(--font-code-block)",
        fontSize: 13,
        fontWeight: 500,
        color: c.text,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: "auto",
        maxWidth: 400,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 20, color: c.icon, flexShrink: 0, fontVariationSettings: "'FILL' 1" }}
      >
        {ICONS[type]}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(id), 300);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: c.text,
          cursor: "pointer",
          padding: 2,
          opacity: 0.6,
          display: "flex",
          flexShrink: 0,
          transition: "opacity 200ms",
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.6"; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} onRemove={removeToast} />
      ))}
    </div>
  );
}
