"use client";

import { useState, useCallback } from "react";
import { useAgentStore } from "@/features/agent-sidebar/assets/useAgentStore";
import { saveSession } from "@/lib/sessionStorage";
import type { SessionRecord, SessionSeverity } from "@/types/session";

export function useDraftReport() {
  const { draftReport, setDraftReport, setFlowStep, setSidebarTab, addLog } =
    useAgentStore();
  const [isSending, setIsSending] = useState(false);
  const [summary, setSummary] = useState(draftReport?.summary ?? "");
  const [reproductionSteps, setReproductionSteps] = useState(
    draftReport?.reproductionSteps ?? ""
  );
  const [severity, setSeverity] = useState<string>(draftReport?.severity ?? "medium");

  const handleSend = useCallback(() => {
    setIsSending(true);

    // 1) 세션 레코드 저장 (동기)
    const now = new Date();
    const sessionId = `session-${Date.now()}`;
    const simpleId = `#QA-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const record: SessionRecord = {
      id: sessionId,
      simpleId,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      maxSeverity: (severity as SessionSeverity) || "medium",
      status: "open",
      summary,
      reproductionSteps,
      errorType: draftReport?.errorType ?? "",
      screenshots: draftReport?.screenshots ?? [],
    };
    saveSession(record);
    addLog("INFO", "Session saved. Syncing to Notion...");

    // 2) UI 즉시 전환
    setFlowStep("sent");
    setSidebarTab("log");
    setDraftReport(null);
    setIsSending(false);

    // 3) Notion 비동기 fire-and-forget
    fetch("/api/notion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        reproductionSteps,
        severity,
        errorType: draftReport?.errorType ?? "",
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Notion sync failed");
        addLog("INFO", "Notion ticket synced successfully!");
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        addLog("WARN", `Notion sync failed: ${msg}`);
      });
  }, [addLog, setDraftReport, setFlowStep, setSidebarTab, summary, reproductionSteps, severity, draftReport?.errorType]);

  return {
    summary,
    reproductionSteps,
    severity,
    errorType: draftReport?.errorType ?? "",
    screenshots: draftReport?.screenshots ?? [],
    isSending,
    onSummaryChange: setSummary,
    onStepsChange: setReproductionSteps,
    onSeverityChange: setSeverity,
    handleSend,
  };
}
