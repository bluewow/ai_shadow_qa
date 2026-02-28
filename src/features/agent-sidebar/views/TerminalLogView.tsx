import { Terminal } from "lucide-react";
import type { LogEntry } from "@/types/agent";

export interface TerminalLogViewProps {
  logs: LogEntry[];
  logEndRef?: React.RefObject<HTMLDivElement | null>;
}

const levelColors: Record<string, string> = {
  INFO: "text-[var(--color-purple)]",
  SCAN: "text-[var(--color-purple)]",
  ACT: "text-[var(--color-purple)]",
  OBS: "text-[var(--color-purple)]",
  WARN: "text-yellow-500 font-medium",
  ERROR: "text-red-500 font-medium",
  ANALYSIS: "text-red-400",
};

export function TerminalLogView({ logs, logEndRef }: TerminalLogViewProps) {
  return (
    <div className="flex-1 px-4 py-2 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Terminal className="w-3 h-3 text-[var(--color-purple)]" />
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Agent Reasoning Log
        </span>
      </div>
      <div className="flex-1 bg-slate-900/50 border border-[var(--color-glass-border)] rounded-lg p-4 font-mono text-xs overflow-y-auto space-y-2">
        {logs.length === 0 && (
          <p className="text-slate-500 italic">
            연결 대기 중... 화면 공유 후 로그가 표시됩니다.
          </p>
        )}
        {logs.map((log, i) => (
          <p key={i} className="text-slate-400">
            [{log.timestamp}]{" "}
            <span className={levelColors[log.level] ?? "text-slate-400"}>
              {log.level}
            </span>{" "}
            {log.message}
          </p>
        ))}
        <div className="w-1 h-3 bg-[var(--color-purple)] animate-pulse inline-block" />
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
