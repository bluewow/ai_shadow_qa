"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Toast } from "@/types/agent";

export interface ToastViewProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const typeStyles: Record<Toast["type"], { border: string; icon: string; text: string }> = {
  info: {
    border: "border-[#06b6d4]/40",
    icon: "ℹ",
    text: "text-[#06b6d4]",
  },
  warn: {
    border: "border-yellow-500/40",
    icon: "⚠",
    text: "text-yellow-500",
  },
  error: {
    border: "border-red-500/40",
    icon: "✕",
    text: "text-red-500",
  },
  success: {
    border: "border-green-500/40",
    icon: "✓",
    text: "text-green-500",
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => setIsVisible(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  const style = typeStyles[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 ${style.border} ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      }`}
      style={{ background: "rgba(15, 23, 42, 0.9)" }}
    >
      <span className={`text-sm ${style.text}`}>{style.icon}</span>
      <span className="text-sm text-slate-200 flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastView({ toasts, onRemove }: ToastViewProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
