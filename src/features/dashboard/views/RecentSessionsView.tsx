import type { SessionRecord } from "@/types/session";

export interface RecentSessionsViewProps {
  sessions: SessionRecord[];
  expanded: boolean;
  canExpand: boolean;
  onToggleExpand: () => void;
  onSessionClick: (sessionId: string) => void;
}

const severityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500",
  high: "bg-yellow-500/10 text-yellow-500",
  medium: "bg-blue-500/10 text-blue-500",
  low: "bg-gray-500/10 text-gray-400",
};

const statusColors: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-500",
  in_progress: "bg-blue-500/10 text-blue-400",
};

export function RecentSessionsView({
  sessions,
  expanded,
  canExpand,
  onToggleExpand,
  onSessionClick,
}: RecentSessionsViewProps) {
  return (
    <div className="rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] overflow-hidden">
      <div className="px-4 py-3 flex justify-between items-center border-b border-[var(--color-glass-border)]">
        <span className="text-xs font-semibold text-white">
          Recent Sessions
        </span>
        {canExpand && (
          <button
            onClick={onToggleExpand}
            className="text-[10px] text-[var(--color-purple-light)] hover:text-[var(--color-purple)] transition-colors"
          >
            {expanded ? "Collapse" : "View All →"}
          </button>
        )}
      </div>

      {/* Header */}
      <div className="grid grid-cols-6 px-4 py-2 text-[10px] text-slate-400 uppercase tracking-wider border-b border-[var(--color-glass-border)]">
        <span>Session</span>
        <span>Date</span>
        <span>Duration</span>
        <span>Errors</span>
        <span>Severity</span>
        <span className="text-right">Status</span>
      </div>

      {/* Rows */}
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => onSessionClick(session.id)}
          className="grid grid-cols-6 px-4 py-2.5 text-xs text-slate-200 items-center border-b border-[var(--color-glass-border)] last:border-b-0 hover:bg-slate-700/40 transition-colors cursor-pointer"
        >
          <span className="text-[var(--color-purple-light)] font-medium">
            {session.simpleId}
          </span>
          <span>{session.date}</span>
          <span>{session.duration}</span>
          <span
            className={
              (session.errorCount ?? 0) >= 5
                ? "text-red-400 font-bold"
                : "text-slate-200"
            }
          >
            {session.errorCount ?? 0}
          </span>
          <span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                severityColors[session.maxSeverity]
              }`}
            >
              {session.maxSeverity}
            </span>
          </span>
          <span className="text-right">
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] capitalize ${
                statusColors[session.status]
              }`}
            >
              {session.status.replace("_", " ")}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
