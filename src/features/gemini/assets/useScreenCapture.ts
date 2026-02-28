"use client";

import { useCallback, useRef, useState } from "react";
import { SCREEN_CAPTURE_CONFIG } from "@/constants/gemini";
import { useAgentStore } from "@/features/agent-sidebar/assets/useAgentStore";

// Module-scope circular buffer for captured frames
const frameBuffer: string[] = [];

export function getBufferedFrames(): string[] {
  return [...frameBuffer];
}

// Inline Web Worker — setInterval inside Worker is NOT throttled in background tabs
function createTimerWorker(intervalMs: number): Worker {
  const code = `
    let id = null;
    self.onmessage = (e) => {
      if (e.data === "start") {
        if (id) clearInterval(id);
        id = setInterval(() => self.postMessage("tick"), ${intervalMs});
      } else if (e.data === "stop") {
        if (id) { clearInterval(id); id = null; }
      }
    };
  `;
  const blob = new Blob([code], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

export function useScreenCapture(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [isCapturing, setIsCapturing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const pausedRef = useRef(false);
  const capturingRef = useRef(false); // grabFrame 중복 호출 방지
  const imageCaptureRef = useRef<ImageCapture | null>(null);
  const { setFps, setLatency } = useAgentStore();

  const captureFrame = useCallback(async () => {
    if (pausedRef.current) return;
    if (!canvasRef.current || !imageCaptureRef.current) return;
    if (capturingRef.current) return; // 이전 grabFrame 아직 진행 중이면 skip

    capturingRef.current = true;
    try {
      const startTime = performance.now();
      const bitmap = await imageCaptureRef.current.grabFrame();

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) { bitmap.close(); return; }

      ctx.drawImage(bitmap, 0, 0, SCREEN_CAPTURE_CONFIG.width, SCREEN_CAPTURE_CONFIG.height);
      bitmap.close();

      const dataUrl = canvasRef.current.toDataURL(
        SCREEN_CAPTURE_CONFIG.mimeType,
        SCREEN_CAPTURE_CONFIG.quality
      );
      const base64 = dataUrl.split(",")[1];
      if (base64) {
        frameBuffer.push(base64);
        if (frameBuffer.length > SCREEN_CAPTURE_CONFIG.bufferSize) {
          frameBuffer.shift();
        }
      }

      const elapsed = performance.now() - startTime;
      setLatency(Math.round(elapsed));
    } catch {
      // grabFrame can fail if track ended or tab is being closed — silently skip
    } finally {
      capturingRef.current = false;
    }
  }, [setLatency]);

  // 캡처 완전 종료 (버퍼 클리어 + 스트림 해제)
  const stopCapture = useCallback(() => {
    pausedRef.current = true;

    if (workerRef.current) {
      workerRef.current.postMessage("stop");
      workerRef.current.terminate();
      workerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    imageCaptureRef.current = null;
    frameBuffer.length = 0;
    setIsCapturing(false);
    setFps(0);
    setLatency(0);
  }, [videoRef, setFps, setLatency]);

  // 캡처 일시정지 (프레임 버퍼 유지, Worker 타이머만 중지)
  const pauseCapture = useCallback(() => {
    pausedRef.current = true;
    if (workerRef.current) {
      workerRef.current.postMessage("stop");
    }
  }, []);

  // 캡처 재개 (pause 상태에서 복귀 — 스트림 재활용, 권한 재요청 없음)
  const resumeCapture = useCallback((): boolean => {
    // 스트림이 끊어졌으면 재개 불가
    if (!streamRef.current || !workerRef.current || !imageCaptureRef.current) {
      return false;
    }
    // track이 ended 상태면 재개 불가
    const track = streamRef.current.getVideoTracks()[0];
    if (!track || track.readyState === "ended") {
      return false;
    }
    frameBuffer.length = 0;
    capturingRef.current = false;
    pausedRef.current = false;
    workerRef.current.postMessage("start");
    setFps(SCREEN_CAPTURE_CONFIG.fps);
    return true;
  }, [setFps]);

  const startCapture = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: SCREEN_CAPTURE_CONFIG.width },
        height: { ideal: SCREEN_CAPTURE_CONFIG.height },
      },
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const canvas = document.createElement("canvas");
    canvas.width = SCREEN_CAPTURE_CONFIG.width;
    canvas.height = SCREEN_CAPTURE_CONFIG.height;
    canvasRef.current = canvas;

    // ImageCapture — MediaStreamTrack에서 직접 프레임을 가져옴 (백그라운드 탭에서도 동작)
    const videoTrack = stream.getVideoTracks()[0];
    imageCaptureRef.current = new ImageCapture(videoTrack);

    frameBuffer.length = 0;
    pausedRef.current = false;
    capturingRef.current = false;
    setIsCapturing(true);
    setFps(SCREEN_CAPTURE_CONFIG.fps);

    // Web Worker 타이머 생성 — 백그라운드 탭에서도 정확한 간격으로 tick 발생
    const intervalMs = 1000 / SCREEN_CAPTURE_CONFIG.fps;
    const worker = createTimerWorker(intervalMs);
    workerRef.current = worker;

    worker.onmessage = () => {
      captureFrame();
    };

    // ImageCapture는 track에서 직접 읽으므로 video readyState 불필요 — 바로 시작
    worker.postMessage("start");

    // Handle stream end (user stops sharing)
    stream.getVideoTracks()[0].onended = () => {
      stopCapture();
    };
  }, [videoRef, setFps, setLatency, stopCapture, captureFrame]);

  return {
    isCapturing,
    startCapture,
    stopCapture,
    pauseCapture,
    resumeCapture,
  };
}
