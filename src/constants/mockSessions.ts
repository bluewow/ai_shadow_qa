import type { SessionRecord, SessionStats } from "@/types/session";
import type { LogEntry } from "@/types/agent";

const logsQA047: LogEntry[] = [
  { timestamp: "14:20:05", level: "SCAN", message: "42 elements detected" },
  { timestamp: "14:20:08", level: "OBS", message: "User navigated to /checkout" },
  { timestamp: "14:20:10", level: "ACT", message: "Input card number field" },
  { timestamp: "14:20:12", level: "ACT", message: "Clicked #checkout-btn" },
  { timestamp: "14:20:15", level: "WARN", message: "Long task detected: 450ms" },
  { timestamp: "14:20:17", level: "ERROR", message: "TypeError: Cannot read properties of null" },
  { timestamp: "14:20:18", level: "ANALYSIS", message: "State mismatch in payment module — cart state cleared before checkout completion" },
];

const logsQA046: LogEntry[] = [
  { timestamp: "11:05:02", level: "SCAN", message: "38 elements detected" },
  { timestamp: "11:05:10", level: "OBS", message: "User viewed /cart" },
  { timestamp: "11:05:15", level: "ACT", message: "Changed quantity to 5" },
  { timestamp: "11:05:18", level: "WARN", message: "UI not updated after quantity change" },
  { timestamp: "11:05:22", level: "ERROR", message: "Stale state: displayed quantity does not match store" },
  { timestamp: "11:05:23", level: "ANALYSIS", message: "React state update batching issue — useEffect dependency missing" },
];

export const MOCK_SESSIONS: SessionRecord[] = [
  {
    id: "session-047",
    simpleId: "#QA-047",
    date: "2026-02-28 14:20",
    duration: "12m 34s",
    durationSeconds: 754,
    errorCount: 5,
    maxSeverity: "critical",
    status: "open",
    summary: "Checkout Payment Flow에서 결제 정보 입력 후 구매 완료 버튼 클릭 시 TypeError 발생",
    reproductionSteps: "1. /checkout 페이지 이동\n2. 결제 카드 정보 입력\n3. \"구매 완료\" 버튼 클릭\n4. TypeError: Cannot read properties of null",
    errorType: "TypeError: null reference",
    tokenUsage: 0.84,
    logs: logsQA047,
  },
  {
    id: "session-046",
    simpleId: "#QA-046",
    date: "2026-02-28 11:05",
    duration: "8m 12s",
    durationSeconds: 492,
    errorCount: 2,
    maxSeverity: "medium",
    status: "open",
    summary: "카트 페이지에서 수량 변경 시 UI가 즉시 업데이트되지 않음",
    reproductionSteps: "1. /cart 페이지 이동\n2. 상품 수량을 5로 변경\n3. 화면에 이전 수량이 표시됨",
    errorType: "State sync error",
    tokenUsage: 0.52,
    logs: logsQA046,
  },
];

export const MOCK_STATS: SessionStats = {
  totalSessions: 2,
  totalErrors: 7,
  weeklyNewSessions: 2,
  notionTickets: 2,
  avgTokenPerSession: 0.68,
  tokenChangePercent: 0,
  severityCounts: {
    critical: 1,
    high: 0,
    medium: 1,
    low: 0,
  },
  dailyTrend: [
    { day: "Mon", critical: 0, high: 0, medium: 0 },
    { day: "Tue", critical: 0, high: 0, medium: 0 },
    { day: "Wed", critical: 0, high: 0, medium: 0 },
    { day: "Thu", critical: 0, high: 0, medium: 0 },
    { day: "Fri", critical: 0, high: 0, medium: 0 },
    { day: "Today", critical: 1, high: 0, medium: 1 },
  ],
};
