import type { SessionRecord, SessionStats, SeverityCount } from "@/types/session";

export function computeStats(sessions: SessionRecord[]): SessionStats {
  const totalSessions = sessions.length;

  const severityCounts: SeverityCount = { critical: 0, high: 0, medium: 0, low: 0 };
  let tokenSum = 0;

  for (const s of sessions) {
    severityCounts[s.maxSeverity] += 1;
    if (s.tokenUsage != null) {
      tokenSum += s.tokenUsage;
    }
  }

  // 세션 1건 = 에러 1건 (보고된 에러 수)
  const totalErrors = totalSessions;
  const totalTokenUsage = Math.round(tokenSum * 100) / 100;

  // 최근 7일 세션 수 계산
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyNewSessions = sessions.filter((s) => {
    const d = new Date(s.date.replace(" ", "T"));
    return d >= weekAgo;
  }).length;

  // dailyTrend: 최근 7일 (간소화 — mock 데이터의 트렌드를 유지하면서 실제 세션 반영)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"];
  const todayIdx = now.getDay(); // 0=Sun
  const dailyTrend = dayLabels.map((day, i) => {
    const daySessions = sessions.filter((s) => {
      const d = new Date(s.date.replace(" ", "T"));
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays === (5 - i);
    });
    return {
      day,
      critical: daySessions.filter((s) => s.maxSeverity === "critical").length,
      high: daySessions.filter((s) => s.maxSeverity === "high").length,
      medium: daySessions.filter((s) => s.maxSeverity === "medium").length,
    };
  });

  return {
    totalSessions,
    totalErrors,
    weeklyNewSessions,
    notionTickets: totalSessions,
    avgTokenPerSession: totalTokenUsage,
    tokenChangePercent: 0,
    severityCounts,
    dailyTrend,
  };
}
