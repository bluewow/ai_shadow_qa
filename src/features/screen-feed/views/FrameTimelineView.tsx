import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, X } from "lucide-react";

export interface FrameTimelineViewProps {
  frameCount: number;
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
  getFrame: (index: number) => string | undefined;
  fps: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function toTimestamp(index: number, fps: number): string {
  if (fps <= 0) return "0.0s";
  return `${(index / fps).toFixed(1)}s`;
}

export function FrameTimelineView({
  frameCount,
  range,
  onRangeChange,
  getFrame,
  fps,
  onConfirm,
  onCancel,
}: FrameTimelineViewProps) {
  const [start, end] = range;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const selectedCount = end - start + 1;

  // Scroll to start on mount
  useEffect(() => {
    if (stripRef.current && start > 0) {
      stripRef.current.scrollLeft = Math.max(0, start * 84 - 40);
    }
  }, [start]);

  // Sample indices for performance
  const { visibleIndices, sampleRate } = useMemo(() => {
    if (frameCount <= 40)
      return { visibleIndices: Array.from({ length: frameCount }, (_, i) => i), sampleRate: 1 };
    const rate = Math.ceil(frameCount / 40);
    const indices: number[] = [];
    for (let i = 0; i < frameCount; i += rate) indices.push(i);
    if (indices[indices.length - 1] !== frameCount - 1) indices.push(frameCount - 1);
    return { visibleIndices: indices, sampleRate: rate };
  }, [frameCount]);

  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onRangeChange([Math.min(v, end), end]);
    },
    [end, onRangeChange],
  );

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onRangeChange([start, Math.max(v, start)]);
    },
    [start, onRangeChange],
  );

  // Frame to preview (hovered or start frame)
  const previewIdx = hoveredIndex ?? start;
  const previewFrame = getFrame(previewIdx);

  if (frameCount === 0) return null;

  return (
    <div className="bg-slate-950/95 border-t border-[var(--color-glass-border)] backdrop-blur-sm">
      {/* Top row: preview + filmstrip */}
      <div className="flex gap-3 px-4 pt-3 pb-2">
        {/* Large preview */}
        <div className="shrink-0 w-48 space-y-1.5">
          <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
            {previewFrame ? (
              <img
                src={`data:image/jpeg;base64,${previewFrame}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                No frame
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-0.5 text-[10px] text-slate-200 font-mono flex justify-between">
              <span>Frame {previewIdx}</span>
              <span>{toTimestamp(previewIdx, fps)}</span>
            </div>
          </div>
          {/* Range info */}
          <div className="text-[10px] text-slate-400 font-mono text-center">
            {selectedCount} / {frameCount} frames ({toTimestamp(start, fps)} – {toTimestamp(end, fps)})
          </div>
        </div>

        {/* Right side: filmstrip + actions */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header + actions */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              Frame Range
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="px-3 py-1 text-[11px] text-slate-400 hover:text-slate-200 border border-slate-600 rounded-md hover:border-slate-500 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                취소
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 text-sm text-white font-bold bg-[var(--color-purple)] rounded-lg hover:brightness-110 shadow-[0_0_20px_rgba(124,58,237,0.5)] animate-pulse transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                분석 시작
              </button>
            </div>
          </div>

          {/* Filmstrip */}
          <div
            ref={stripRef}
            className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-600"
          >
            {visibleIndices.map((idx) => {
              const inRange = idx >= start && idx <= end;
              const isEdge = idx === start || idx === end;
              const frame = getFrame(idx);
              return (
                <div
                  key={idx}
                  className={`relative shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    isEdge
                      ? "border-[var(--color-purple)] ring-1 ring-[var(--color-purple)]/40"
                      : inRange
                        ? "border-slate-500 opacity-100"
                        : "border-slate-700 opacity-30 hover:opacity-60"
                  }`}
                  onClick={() => {
                    const distToStart = Math.abs(idx - start);
                    const distToEnd = Math.abs(idx - end);
                    if (distToStart <= distToEnd) {
                      onRangeChange([idx, end]);
                    } else {
                      onRangeChange([start, idx]);
                    }
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {frame ? (
                    <img
                      src={`data:image/jpeg;base64,${frame}`}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700" />
                  )}
                  {/* Frame index label */}
                  <span className="absolute bottom-0 right-0 text-[8px] text-slate-400 bg-black/70 px-1 leading-relaxed font-mono">
                    {toTimestamp(idx, fps)}
                  </span>
                  {/* Start/End badge */}
                  {isEdge && (
                    <span className="absolute top-0 left-0 text-[8px] font-bold text-white bg-[var(--color-purple)]/80 px-1 leading-relaxed">
                      {idx === start ? "S" : "E"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dual range slider */}
          <div className="mt-1">
            <div className="relative h-5">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-700 rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1 bg-[var(--color-purple)]/60 rounded-full"
                style={{
                  left: `${(start / Math.max(frameCount - 1, 1)) * 100}%`,
                  right: `${100 - (end / Math.max(frameCount - 1, 1)) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={frameCount - 1}
                value={start}
                onChange={handleStartChange}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-purple)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(6,182,212,0.5)]"
              />
              <input
                type="range"
                min={0}
                max={frameCount - 1}
                value={end}
                onChange={handleEndChange}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-purple)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(6,182,212,0.5)]"
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>{toTimestamp(0, fps)}</span>
              <span>{toTimestamp(frameCount - 1, fps)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
