"use client";

import { useState, useCallback } from "react";
import { DashboardLayoutView } from "../views/DashboardLayoutView";
import { HeaderView, type TabName } from "../views/HeaderView";
import { ActiveSessionContentView } from "../views/ActiveSessionContentView";
import { FlowBarView } from "../views/FlowBarView";
import { StatusBarView } from "../views/StatusBarView";
import { ToastView } from "../views/ToastView";
import { ScreenFeed } from "@/features/screen-feed";
import { AgentSidebar } from "@/features/agent-sidebar";
import { DashboardContent } from "@/features/dashboard";
import { HistoryContent } from "@/features/history";
import { useAgentStore } from "@/features/agent-sidebar/assets/useAgentStore";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard");
  const [initialSessionId, setInitialSessionId] = useState<string | null>(null);
  const { status, tokenUsage, isRecording, flowStep, toasts, removeToast, resetSession } = useAgentStore();

  const handleStartSession = () => {
    resetSession();
    setActiveTab("Active Session");
  };

  const handleSessionClick = useCallback((sessionId: string) => {
    setInitialSessionId(sessionId);
    setActiveTab("History");
  }, []);

  const handleTabChange = useCallback((tab: TabName) => {
    if (tab !== "History") {
      setInitialSessionId(null);
    }
    setActiveTab(tab);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardContent
            onStartSession={handleStartSession}
            onSessionClick={handleSessionClick}
          />
        );
      case "Active Session":
        return (
          <ActiveSessionContentView
            screenFeed={<ScreenFeed />}
            agentSidebar={<AgentSidebar />}
          />
        );
      case "History":
        return <HistoryContent initialSessionId={initialSessionId} />;
    }
  };

  return (
    <>
      <DashboardLayoutView
        header={
          <HeaderView
            isRecording={isRecording}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        }
        flowBar={
          activeTab === "Active Session" ? (
            <FlowBarView flowStep={flowStep} />
          ) : undefined
        }
        content={renderContent()}
        statusBar={
          <StatusBarView agentStatus={status} tokenUsage={tokenUsage} />
        }
      />
      <ToastView toasts={toasts} onRemove={removeToast} />
    </>
  );
}
