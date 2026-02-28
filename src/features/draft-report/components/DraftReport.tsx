"use client";

import { useEffect } from "react";
import { useDraftReport } from "../assets/useDraftReport";
import { DraftReportView } from "../views/DraftReportView";

export function DraftReport() {
  const {
    summary,
    reproductionSteps,
    severity,
    errorType,
    screenshots,
    onSummaryChange,
    onStepsChange,
    onSeverityChange,
    handleSend,
  } = useDraftReport();

  // Listen for send event from AnalyzeButtonView
  useEffect(() => {
    const handler = () => handleSend();
    window.addEventListener("draft-report-send", handler);
    return () => window.removeEventListener("draft-report-send", handler);
  }, [handleSend]);

  return (
    <DraftReportView
      summary={summary}
      reproductionSteps={reproductionSteps}
      severity={severity}
      errorType={errorType}
      screenshots={screenshots}
      onSummaryChange={onSummaryChange}
      onStepsChange={onStepsChange}
      onSeverityChange={onSeverityChange}
    />
  );
}
