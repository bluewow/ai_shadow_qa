export type LogLevel = "INFO" | "SCAN" | "ACT" | "OBS" | "WARN" | "ERROR" | "ANALYSIS";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface DraftReport {
  summary: string;
  reproductionSteps: string;
  severity: "critical" | "high" | "medium" | "low";
  errorType: string;
  screenshots: string[];
}

export type AgentStatus = "idle" | "watching" | "analyzing" | "error";

export type SidebarTab = "log" | "report";

export type FlowStep = "idle" | "capturing" | "selecting" | "analyzing" | "report" | "sent";

export type ToastType = "info" | "warn" | "error" | "success";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface AgentState {
  status: AgentStatus;
  logs: LogEntry[];
  draftReport: DraftReport | null;
  isRecording: boolean;
  fps: number;
  latency: number;
}
