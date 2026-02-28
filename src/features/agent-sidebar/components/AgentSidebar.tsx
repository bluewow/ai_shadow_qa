"use client";

import { useAgentSidebar } from "../assets/useAgentSidebar";
import { AgentSidebarView } from "../views/AgentSidebarView";
import { TerminalLogView } from "../views/TerminalLogView";
import { AnalyzeButtonView } from "../views/AnalyzeButtonView";
import { ReportEmptyView } from "../views/ReportEmptyView";
import { DraftReport } from "@/features/draft-report";

export function AgentSidebar() {
  const {
    logs,
    status,
    flowStep,
    logEndRef,
    handleAnalyze,
    draftReport,
    sidebarTab,
    setSidebarTab,
  } = useAgentSidebar();

  const hasReport = draftReport !== null;

  return (
    <AgentSidebarView
      activeTab={sidebarTab}
      onTabChange={setSidebarTab}
      hasReport={hasReport}
      terminalLog={<TerminalLogView logs={logs} logEndRef={logEndRef} />}
      reportPanel={hasReport ? <DraftReport /> : <ReportEmptyView />}
      bottomAction={
        <AnalyzeButtonView
          status={status}
          sidebarTab={sidebarTab}
          hasReport={hasReport}
          flowStep={flowStep}
          onAnalyze={handleAnalyze}
        />
      }
    />
  );
}
