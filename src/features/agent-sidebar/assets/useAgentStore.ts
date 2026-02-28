"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { LogEntry, LogLevel, AgentStatus, Toast, ToastType, SidebarTab, FlowStep } from "@/types/agent";
import type { DraftReport } from "@/types/agent";

interface AgentStoreState {
  status: AgentStatus;
  logs: LogEntry[];
  draftReport: DraftReport | null;
  isRecording: boolean;
  fps: number;
  latency: number;
  tokenUsage: number;
  showDraftReport: boolean;
  sidebarTab: SidebarTab;
  flowStep: FlowStep;
  toasts: Toast[];
  /** Number of frames available for range selection (actual data stored outside store for perf) */
  frameCount: number;
  frameRange: [number, number];
}

const initialState: AgentStoreState = {
  status: "idle",
  logs: [],
  draftReport: null,
  isRecording: false,
  fps: 0,
  latency: 0,
  tokenUsage: 0,
  showDraftReport: false,
  sidebarTab: "log",
  flowStep: "idle",
  toasts: [],
  frameCount: 0,
  frameRange: [0, 0],
};

// Module-scope frame storage to avoid putting large base64 arrays in reactive state
let _capturedFrames: string[] = [];

export function getCapturedFrames(): string[] {
  return _capturedFrames;
}

export function setCapturedFrames(frames: string[]): void {
  _capturedFrames = frames;
}

export function clearCapturedFrames(): void {
  _capturedFrames = [];
}

let state = { ...initialState };
const listeners = new Set<() => void>();

function emitChange() {
  state = { ...state };
  listeners.forEach((listener) => listener());
}

export function getSnapshot() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function formatTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

export function useAgentStore() {
  const storeState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addLog = useCallback((level: LogLevel, message: string) => {
    const entry: LogEntry = { timestamp: formatTime(), level, message };
    state = { ...state, logs: [...state.logs, entry] };
    emitChange();
  }, []);

  const setStatus = useCallback((status: AgentStatus) => {
    state = { ...state, status };
    emitChange();
  }, []);

  const setRecording = useCallback((isRecording: boolean) => {
    state = { ...state, isRecording };
    emitChange();
  }, []);

  const setFps = useCallback((fps: number) => {
    state = { ...state, fps };
    emitChange();
  }, []);

  const setLatency = useCallback((latency: number) => {
    state = { ...state, latency };
    emitChange();
  }, []);

  const setDraftReport = useCallback((draftReport: DraftReport | null) => {
    state = {
      ...state,
      draftReport,
      showDraftReport: draftReport !== null,
      sidebarTab: draftReport !== null ? "report" : state.sidebarTab,
      flowStep: draftReport !== null ? "report" : state.flowStep,
    };
    emitChange();
  }, []);

  const setShowDraftReport = useCallback((showDraftReport: boolean) => {
    state = { ...state, showDraftReport };
    emitChange();
  }, []);

  const addTokenUsage = useCallback((amount: number) => {
    state = { ...state, tokenUsage: state.tokenUsage + amount };
    emitChange();
  }, []);

  const clearLogs = useCallback(() => {
    state = { ...state, logs: [] };
    emitChange();
  }, []);

  const resetSession = useCallback(() => {
    state = { ...initialState };
    emitChange();
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = { id, message, type };
    state = { ...state, toasts: [...state.toasts, toast] };
    emitChange();
    setTimeout(() => {
      state = { ...state, toasts: state.toasts.filter((t) => t.id !== id) };
      emitChange();
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    state = { ...state, toasts: state.toasts.filter((t) => t.id !== id) };
    emitChange();
  }, []);

  const setSidebarTab = useCallback((sidebarTab: SidebarTab) => {
    state = { ...state, sidebarTab };
    emitChange();
  }, []);

  const setFlowStep = useCallback((flowStep: FlowStep) => {
    state = { ...state, flowStep };
    emitChange();
  }, []);

  const setFrameCount = useCallback((frameCount: number) => {
    state = { ...state, frameCount };
    emitChange();
  }, []);

  const setFrameRange = useCallback((frameRange: [number, number]) => {
    state = { ...state, frameRange };
    emitChange();
  }, []);

  return {
    ...storeState,
    addLog,
    setStatus,
    setRecording,
    setFps,
    setLatency,
    setDraftReport,
    setShowDraftReport,
    addTokenUsage,
    clearLogs,
    resetSession,
    addToast,
    removeToast,
    setSidebarTab,
    setFlowStep,
    setFrameCount,
    setFrameRange,
  };
}
