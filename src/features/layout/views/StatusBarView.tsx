import type { AgentStatus } from "@/types/agent";

export interface StatusBarViewProps {
  agentStatus: AgentStatus;
  tokenUsage: number;
}

export function StatusBarView({ agentStatus, tokenUsage }: StatusBarViewProps) {
  const isActive = agentStatus === "watching" || agentStatus === "analyzing";

  return (
    <footer className="h-8 border-t border-[var(--color-glass-border)] bg-[var(--color-dark-bg)] flex items-center justify-between px-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-green-500" : "bg-slate-600"
            }`}
          />
          <span>{isActive ? "Engine Active" : "Engine Standby"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600">|</span>
          <span>Environment: Production-Mirror</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>Worker ID: SH-882-QA</span>
        <span>Token Usage: {tokenUsage.toFixed(3)}k</span>
      </div>
    </footer>
  );
}
