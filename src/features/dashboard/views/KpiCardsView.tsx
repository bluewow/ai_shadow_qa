import type { SeverityCount } from "@/types/session";

export interface KpiCardsViewProps {
  totalSessions: number;
  weeklyNewSessions: number;
  totalErrors: number;
  severityCounts: SeverityCount;
  notionTickets: number;
  avgTokenPerSession: number;
  tokenChangePercent: number;
}

export function KpiCardsView({
  totalSessions,
  weeklyNewSessions,
  totalErrors,
  severityCounts,
  notionTickets,
  avgTokenPerSession,
  tokenChangePercent,
}: KpiCardsViewProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Total Sessions */}
      <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
          Total Sessions
        </p>
        <p className="text-white text-2xl font-bold">{totalSessions}</p>
        <p className="text-slate-400 text-xs mt-1">
          이번 주 +{weeklyNewSessions}
        </p>
      </div>

      {/* Errors Found */}
      <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
          Errors Found
        </p>
        <p className="text-red-400 text-2xl font-bold">{totalErrors}</p>
        <p className="text-red-500/70 text-xs mt-1">
          Critical {severityCounts.critical} · High {severityCounts.high}
        </p>
      </div>

      {/* Notion Tickets */}
      <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
          Notion Tickets
        </p>
        <p className="text-green-400 text-2xl font-bold">{notionTickets}</p>
        <p className="text-slate-400 text-xs mt-1">전송된 버그 리포트</p>
      </div>

      {/* Total Tokens */}
      <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
          Total Tokens
        </p>
        <p className="text-[var(--color-purple-light)] text-2xl font-bold">
          {avgTokenPerSession}k
        </p>
        <p className="text-slate-400 text-xs mt-1">
          전체 세션 토큰 합계
        </p>
      </div>
    </div>
  );
}
