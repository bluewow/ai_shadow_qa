"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useScreenCapture } from "@/features/gemini/assets/useScreenCapture";
import { useAgentStore, getCapturedFrames } from "@/features/agent-sidebar/assets/useAgentStore";
import { ScreenFeedView } from "../views/ScreenFeedView";
import { FrameTimelineView } from "../views/FrameTimelineView";

const RESUME_COUNTDOWN_SEC = 3;

export function ScreenFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCapturing, startCapture, stopCapture, pauseCapture, resumeCapture } =
    useScreenCapture(videoRef);
  const {
    fps, latency, flowStep, frameCount, frameRange,
    setRecording, setStatus, setFlowStep, addLog,
    setFrameRange,
  } = useAgentStore();

  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = useCallback(async () => {
    try {
      addLog("INFO", "Starting screen capture...");
      await startCapture();
      setRecording(true);
      setStatus("watching");
      setFlowStep("capturing");
      addLog("INFO", "Session started. Attaching to screen feed...");
      addLog("SCAN", "Mapping visible elements on screen.");
    } catch {
      addLog("ERROR", "Failed to start screen capture.");
      setStatus("error");
    }
  }, [startCapture, setRecording, setStatus, setFlowStep, addLog]);

  const handleStop = useCallback(() => {
    // 카운트다운 중이면 취소
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setCountdown(null);
    }
    stopCapture();
    setRecording(false);
    setStatus("idle");
    setFlowStep("idle");
    addLog("INFO", "Session stopped. Screen capture ended.");
  }, [stopCapture, setRecording, setStatus, setFlowStep, addLog]);

  // flowStep이 "sent"로 변경되면 카운트다운 시작
  useEffect(() => {
    if (flowStep !== "sent") return;

    addLog("INFO", `Resuming capture in ${RESUME_COUNTDOWN_SEC}s...`);
    setCountdown(RESUME_COUNTDOWN_SEC);

    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    countdownRef.current = id;
    return () => {
      clearInterval(id);
      countdownRef.current = null;
    };
  }, [flowStep, addLog]);

  // 카운트다운이 0에 도달하면 resume 실행
  useEffect(() => {
    if (countdown !== 0) return;

    const success = resumeCapture();
    if (success) {
      setFlowStep("capturing");
      setStatus("watching");
      addLog("INFO", "Capture resumed. Ready for next analysis.");
    } else {
      // 스트림이 끊어진 경우 — idle로 fallback
      handleStop();
      addLog("WARN", "Screen sharing ended. Start a new capture session.");
    }
    setCountdown(null);
  }, [countdown, resumeCapture, setFlowStep, setStatus, addLog, handleStop]);

  // 분석 트리거 시 캡처 일시정지 (더 이상 프레임이 쌓이지 않음)
  useEffect(() => {
    const handlePause = () => pauseCapture();
    window.addEventListener("pause-capture", handlePause);
    return () => window.removeEventListener("pause-capture", handlePause);
  }, [pauseCapture]);

  const isSelecting = flowStep === "selecting";

  const getFrame = useCallback((index: number): string | undefined => {
    return getCapturedFrames()[index];
  }, []);

  const handleConfirm = useCallback(() => {
    window.dispatchEvent(new CustomEvent("frame-range-confirmed"));
  }, []);

  const handleCancel = useCallback(() => {
    setFlowStep("capturing");
    setStatus("watching");
    addLog("INFO", "Frame selection cancelled.");
  }, [setFlowStep, setStatus, addLog]);

  return (
    <ScreenFeedView
      isCapturing={isCapturing}
      fps={fps}
      latency={latency}
      videoRef={videoRef}
      onStart={handleStart}
      onStop={handleStop}
      countdown={countdown}
      onEndSession={handleStop}
      frameTimeline={
        isSelecting ? (
          <FrameTimelineView
            frameCount={frameCount}
            range={frameRange}
            onRangeChange={setFrameRange}
            getFrame={getFrame}
            fps={fps || 5}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : undefined
      }
    />
  );
}
