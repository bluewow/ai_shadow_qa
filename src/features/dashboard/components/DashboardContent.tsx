"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { DashboardContentView } from "../views/DashboardContentView";
import { KpiCardsView } from "../views/KpiCardsView";
import { ErrorTrendChartView } from "../views/ErrorTrendChartView";
import { SeverityDonutView } from "../views/SeverityDonutView";
import { RecentSessionsView } from "../views/RecentSessionsView";
import { MOCK_SESSIONS } from "@/constants/mockSessions";
import { getSessions } from "@/lib/sessionStorage";
import { computeStats } from "@/lib/computeStats";
import type { SessionRecord } from "@/types/session";

interface DashboardContentProps {
  onStartSession: () => void;
  onSessionClick: (sessionId: string) => void;
}

export function DashboardContent({ onStartSession, onSessionClick }: DashboardContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    setSavedSessions(getSessions());
  }, []);

  const allSessions = useMemo(
    () => [...savedSessions, ...MOCK_SESSIONS],
    [savedSessions]
  );

  const stats = useMemo(() => computeStats(allSessions), [allSessions]);

  const displayedSessions = expanded ? allSessions : allSessions.slice(0, 4);
  const canExpand = allSessions.length > 4;

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <DashboardContentView
      onStartSession={onStartSession}
      kpiCards={
        <KpiCardsView
          totalSessions={stats.totalSessions}
          weeklyNewSessions={stats.weeklyNewSessions}
          totalErrors={stats.totalErrors}
          severityCounts={stats.severityCounts}
          notionTickets={stats.notionTickets}
          avgTokenPerSession={stats.avgTokenPerSession}
          tokenChangePercent={stats.tokenChangePercent}
        />
      }
      errorTrendChart={<ErrorTrendChartView data={stats.dailyTrend} />}
      severityDonut={
        <SeverityDonutView
          totalErrors={stats.totalErrors}
          severityCounts={stats.severityCounts}
        />
      }
      recentSessions={
        <RecentSessionsView
          sessions={displayedSessions}
          expanded={expanded}
          canExpand={canExpand}
          onToggleExpand={handleToggleExpand}
          onSessionClick={onSessionClick}
        />
      }
    />
  );
}
