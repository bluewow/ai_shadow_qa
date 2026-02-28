import type { LogEntry } from "./agent";

export type SessionSeverity = "critical" | "high" | "medium" | "low";
export type SessionStatus = "open" | "in_progress";

export interface SessionRecord {
  id: string;
  simpleId: string;
  date: string;
  duration?: string;
  durationSeconds?: number;
  errorCount?: number;
  maxSeverity: SessionSeverity;
  status: SessionStatus;
  summary: string;
  reproductionSteps: string;
  errorType: string;
  screenshots?: string[];
  tokenUsage?: number;
  logs?: LogEntry[];
}

export interface SeverityCount {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface DailyErrorTrend {
  day: string;
  critical: number;
  high: number;
  medium: number;
}

export interface SessionStats {
  totalSessions: number;
  totalErrors: number;
  weeklyNewSessions: number;
  notionTickets: number;
  avgTokenPerSession: number;
  tokenChangePercent: number;
  severityCounts: SeverityCount;
  dailyTrend: DailyErrorTrend[];
}
