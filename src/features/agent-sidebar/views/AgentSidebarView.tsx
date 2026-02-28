import type { ReactNode } from "react";
import type { SidebarTab } from "@/types/agent";

export interface AgentSidebarViewProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  hasReport: boolean;
  terminalLog: ReactNode;
  reportPanel: ReactNode;
  bottomAction: ReactNode;
}

export function AgentSidebarView({
  activeTab,
  onTabChange,
  hasReport,
  terminalLog,
  reportPanel,
  bottomAction,
}: AgentSidebarViewProps) {
  return (
    <>
      <div className="flex border-b border-[var(--color-glass-border)] text-xs shrink-0">
        <button
          onClick={() => onTabChange("log")}
          className={`flex-1 py-2.5 text-center font-medium transition-colors ${
            activeTab === "log"
              ? "text-white border-b-2 border-[var(--color-purple)] bg-[var(--color-purple)]/10"
              : "text-slate-400 hover:text-slate-200 border-b-2 border-transparent"
          }`}
        >
          🖥 로그
        </button>
        <button
          onClick={() => onTabChange("report")}
          className={`flex-1 py-2.5 text-center font-medium transition-colors relative ${
            activeTab === "report"
              ? "text-white border-b-2 border-[var(--color-purple)] bg-[var(--color-purple)]/10"
              : "text-slate-400 hover:text-slate-200 border-b-2 border-transparent"
          }`}
        >
          📋 리포트
          {hasReport && activeTab !== "report" && (
            <span className="absolute top-1.5 right-[calc(50%-28px)] w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "log" ? terminalLog : reportPanel}
      </div>
      {bottomAction}
    </>
  );
}
