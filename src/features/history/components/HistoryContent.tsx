"use client";

import { useEffect, useMemo, useState } from "react";
import type { SessionRecord } from "@/types/session";
import { HistoryContentView } from "../views/HistoryContentView";
import { SessionListView } from "../views/SessionListView";
import { SessionDetailView } from "../views/SessionDetailView";
import { EmptyDetailView } from "../views/EmptyDetailView";
import { useHistory } from "../assets/useHistory";
import { MOCK_SESSIONS } from "@/constants/mockSessions";
import { getSessions } from "@/lib/sessionStorage";
import { exportSessionsCsv } from "@/lib/exportCsv";

interface HistoryContentProps {
  initialSessionId?: string | null;
}

export function HistoryContent({ initialSessionId }: HistoryContentProps) {
  const [savedSessions, setSavedSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    setSavedSessions(getSessions());
  }, []);

  const allSessions = useMemo(
    () => [...savedSessions, ...MOCK_SESSIONS],
    [savedSessions]
  );

  const {
    selectedSessionId,
    setSelectedSessionId,
    filterSeverity,
    setFilterSeverity,
    searchQuery,
    setSearchQuery,
    filteredSessions,
    selectedSession,
  } = useHistory(allSessions, initialSessionId ?? undefined);

  const handleExport = () => {
    exportSessionsCsv(filteredSessions);
  };

  return (
    <HistoryContentView
      sessionList={
        <SessionListView
          sessions={filteredSessions}
          selectedSessionId={selectedSessionId}
          filterSeverity={filterSeverity}
          searchQuery={searchQuery}
          onSelectSession={setSelectedSessionId}
          onFilterChange={setFilterSeverity}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
        />
      }
      sessionDetail={
        selectedSession ? (
          <SessionDetailView session={selectedSession} />
        ) : (
          <EmptyDetailView />
        )
      }
    />
  );
}
