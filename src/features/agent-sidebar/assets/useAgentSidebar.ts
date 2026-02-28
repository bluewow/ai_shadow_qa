"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAgentStore, setCapturedFrames, getCapturedFrames, clearCapturedFrames } from "./useAgentStore";
import { useGeminiAnalyze } from "@/features/gemini/assets/useGeminiAnalyze";
import { getBufferedFrames } from "@/features/gemini/assets/useScreenCapture";

export function useAgentSidebar() {
  const store = useAgentStore();
  const logEndRef = useRef<HTMLDivElement>(null);

  const { analyzeFrames } = useGeminiAnalyze();

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.logs]);

  // "ANALYZE ERROR" button → enter frame selection mode
  const handleAnalyze = useCallback(() => {
    if (store.status === "analyzing") return;

    const frames = getBufferedFrames();
    if (frames.length === 0) {
      store.addLog("WARN", "No frames captured yet. Start capture first.");
      return;
    }

    // 캡처 즉시 일시정지 — 에러 분석 시점 이후 프레임이 쌓이지 않도록
    window.dispatchEvent(new CustomEvent("pause-capture"));

    // Store frames in module scope (not in reactive state for perf)
    setCapturedFrames(frames);
    store.setFrameCount(frames.length);
    store.setFrameRange([0, frames.length - 1]);
    store.setFlowStep("selecting");
    store.addLog("INFO", `Capture paused. ${frames.length} frames captured. Select analysis range.`);
  }, [store]);

  // Listen for confirm event from ScreenFeed's FrameTimeline
  useEffect(() => {
    const handleConfirm = async () => {
      const allFrames = getCapturedFrames();
      const [start, end] = store.frameRange;
      const selectedFrames = allFrames.slice(start, end + 1);

      store.addLog("INFO", `Analyzing frames ${start}–${end} (${selectedFrames.length} frames)`);
      await analyzeFrames(selectedFrames);
      clearCapturedFrames();
    };

    window.addEventListener("frame-range-confirmed", handleConfirm);
    return () => window.removeEventListener("frame-range-confirmed", handleConfirm);
  }, [store, analyzeFrames]);

  return {
    ...store,
    logEndRef,
    handleAnalyze,
  };
}
