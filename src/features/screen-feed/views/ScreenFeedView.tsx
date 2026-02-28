import type { ReactNode } from "react";
import { Monitor, Square } from "lucide-react";

export interface ScreenFeedViewProps {
  isCapturing: boolean;
  fps: number;
  latency: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStart: () => void;
  onStop: () => void;
  frameTimeline?: ReactNode;
  countdown?: number | null;
  onEndSession?: () => void;
}

export function ScreenFeedView({
  isCapturing,
  fps,
  latency,
  videoRef,
  onStart,
  onStop,
  frameTimeline,
  countdown,
  onEndSession,
}: ScreenFeedViewProps) {
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
      {/* Video area */}
      <div className="relative flex-1 min-h-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-contain"
        />

        {/* Idle state — start button */}
        {!isCapturing && !frameTimeline && countdown == null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Monitor className="w-10 h-10 text-slate-500" />
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm font-medium mb-1">
                모니터링할 윈도우를 선택하세요
              </p>
              <p className="text-slate-500 text-xs">
                화면 공유를 통해 AI가 실시간으로 분석합니다
              </p>
            </div>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-semibold rounded-lg hover:to-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Start Capture
            </button>
          </div>
        )}

        {/* Capturing state — overlays (hidden during frame selection) */}
        {isCapturing && !frameTimeline && (
          <>
            {/* Scan line effect */}
            <div className="scan-line pointer-events-none opacity-30" />

            {/* REC indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 pulse-rec" />
              <span className="text-[11px] font-bold tracking-widest text-white uppercase">
                REC
              </span>
            </div>

            {/* FPS / Latency */}
            <div className="absolute top-4 right-4 text-[11px] text-slate-400 bg-black/70 px-3 py-1.5 rounded-lg border border-white/10 font-mono">
              FPS: {fps} &bull; LATENCY: {latency}ms
            </div>

            {/* Stop button */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button
                onClick={onStop}
                className="px-4 py-2 bg-black/70 border border-slate-600 text-slate-200 text-xs rounded-lg backdrop-blur-sm hover:bg-slate-700 hover:border-slate-500 transition-all flex items-center gap-2"
              >
                <Square className="w-3 h-3 fill-red-500 text-red-500" />
                Stop Capture
              </button>
            </div>
          </>
        )}

        {/* Paused indicator (shown during frame selection) */}
        {frameTimeline && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[11px] font-bold tracking-widest text-yellow-400 uppercase">
              Paused
            </span>
          </div>
        )}

        {/* Countdown overlay — auto-resume after report sent */}
        {countdown != null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-400 flex items-center justify-center mb-3" style={{ background: "rgba(16,185,129,0.15)" }}>
              <span className="text-3xl font-bold text-emerald-400">{countdown}</span>
            </div>
            <p className="text-slate-200 text-sm font-medium mb-1">캡처 재개 중...</p>
            <p className="text-slate-500 text-[11px] mb-3">자동으로 모니터링이 재개됩니다</p>
            {onEndSession && (
              <button
                onClick={onEndSession}
                className="px-4 py-1.5 rounded-lg text-xs text-slate-400 border border-slate-600 hover:text-white hover:border-slate-400 transition-colors"
              >
                세션 종료
              </button>
            )}
          </div>
        )}
      </div>

      {/* Frame timeline (shown during selecting step) */}
      {frameTimeline}
    </div>
  );
}
