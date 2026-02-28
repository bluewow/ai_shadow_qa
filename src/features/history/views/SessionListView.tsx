import { Search, Download } from "lucide-react";
import type { SessionRecord, SessionSeverity } from "@/types/session";

type SeverityFilter = SessionSeverity | "all";

export interface SessionListViewProps {
  sessions: SessionRecord[];
  selectedSessionId: string;
  filterSeverity: SeverityFilter;
  searchQuery: string;
  onSelectSession: (id: string) => void;
  onFilterChange: (filter: SeverityFilter) => void;
  onSearchChange: (query: string) => void;
  onExport?: () => void;
}

const severityBadge: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500",
  high: "bg-yellow-500/10 text-yellow-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-gray-500/10 text-gray-400",
};

const filterTabs: { value: SeverityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function SessionListView({
  sessions,
  selectedSessionId,
  filterSeverity,
  searchQuery,
  onSelectSession,
  onFilterChange,
  onSearchChange,
  onExport,
}: SessionListViewProps) {
  return (
    <div className="w-[45%] border-r border-[var(--color-glass-border)] flex flex-col h-full">
      <div className="p-3 space-y-3 flex-shrink-0">
        {/* Search + Export */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="세션 검색..."
              className="bg-transparent text-xs text-white placeholder-slate-400 outline-none w-full"
            />
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium text-slate-400 border border-[var(--color-glass-border)] hover:text-white hover:border-slate-500 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          )}
        </div>

        {/* Filter Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${
                filterSeverity === tab.value
                  ? "bg-[var(--color-purple)]/20 text-[var(--color-purple-light)] border border-[var(--color-purple)]/30"
                  : "bg-slate-700/40 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {sessions.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-8">
            검색 결과가 없습니다
          </p>
        )}
        {sessions.map((session) => {
          const isSelected = session.id === selectedSessionId;
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                isSelected
                  ? "bg-[var(--color-purple)]/[0.08] border-l-2 border-[var(--color-purple)] border-t border-r border-b border-t-[var(--color-purple)]/15 border-r-[var(--color-purple)]/15 border-b-[var(--color-purple)]/15"
                  : "bg-slate-800/40 border border-[var(--color-glass-border)] hover:bg-slate-700/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-bold ${
                    isSelected
                      ? "text-[var(--color-purple-light)]"
                      : "text-slate-400"
                  }`}
                >
                  {session.simpleId}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    severityBadge[session.maxSeverity]
                  }`}
                >
                  {session.maxSeverity}
                </span>
              </div>
              <p
                className={`text-[11px] font-medium mb-1.5 line-clamp-1 ${
                  isSelected ? "text-white" : "text-slate-200"
                }`}
              >
                {session.summary}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>{session.date}</span>
                {session.duration && (
                  <>
                    <span>·</span>
                    <span>{session.duration}</span>
                  </>
                )}
                {session.errorCount != null && (
                  <>
                    <span>·</span>
                    <span
                      className={
                        session.errorCount >= 5 ? "text-red-400" : "text-slate-400"
                      }
                    >
                      {session.errorCount} errors
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
