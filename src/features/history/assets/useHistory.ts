"use client";

import { useState, useMemo } from "react";
import type { SessionRecord, SessionSeverity } from "@/types/session";

type SeverityFilter = SessionSeverity | "all";

export function useHistory(sessions: SessionRecord[], initialSessionId?: string) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId ?? sessions[0]?.id ?? ""
  );
  const [filterSeverity, setFilterSeverity] =
    useState<SeverityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (
        filterSeverity !== "all" &&
        session.maxSeverity !== filterSeverity
      ) {
        return false;
      }
      if (
        searchQuery &&
        !session.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !session.simpleId.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [sessions, filterSeverity, searchQuery]);

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId) ?? null;
  }, [sessions, selectedSessionId]);

  return {
    selectedSessionId,
    setSelectedSessionId,
    filterSeverity,
    setFilterSeverity,
    searchQuery,
    setSearchQuery,
    filteredSessions,
    selectedSession,
  };
}
