import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export interface DashboardContentViewProps {
  kpiCards: ReactNode;
  errorTrendChart: ReactNode;
  severityDonut: ReactNode;
  recentSessions: ReactNode;
  onStartSession: () => void;
}

export function DashboardContentView({
  kpiCards,
  errorTrendChart,
  severityDonut,
  recentSessions,
  onStartSession,
}: DashboardContentViewProps) {
  return (
    <div className="w-full bg-[var(--color-dark-bg)] p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <p className="text-slate-400 text-xs">프로젝트 QA 현황 요약</p>
          </div>
          <button
            onClick={onStartSession}
            className="px-4 py-2 bg-[var(--color-purple)] hover:bg-[var(--color-purple-dark)] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Session
          </button>
        </div>

        {/* KPI Cards */}
        {kpiCards}

        {/* Charts Row */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3">{errorTrendChart}</div>
          <div className="col-span-2">{severityDonut}</div>
        </div>

        {/* Recent Sessions */}
        {recentSessions}
      </div>
    </div>
  );
}
