import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const severityOptions = ["critical", "high", "medium", "low"] as const;

const severityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 ring-red-500/50",
  high: "bg-orange-500/20 text-orange-400 ring-orange-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 ring-yellow-500/50",
  low: "bg-green-500/20 text-green-400 ring-green-500/50",
};

export interface DraftReportViewProps {
  summary: string;
  reproductionSteps: string;
  severity: string;
  errorType: string;
  screenshots: string[];
  onSummaryChange: (value: string) => void;
  onStepsChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
}

function KeyFrames({ screenshots }: { screenshots: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
          Key Frames ({screenshots.length})
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {screenshots.map((base64, i) => (
            <img
              key={i}
              src={`data:image/jpeg;base64,${base64}`}
              alt={`Key frame ${i + 1}`}
              className="h-16 w-auto rounded border border-white/10 shrink-0 object-cover cursor-pointer hover:border-[var(--color-purple)]/50 hover:opacity-80 transition-all"
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-[85vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`data:image/jpeg;base64,${screenshots[lightboxIndex]}`}
              alt={`Key frame ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] rounded-lg border border-white/10 object-contain"
            />

            {/* Frame counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-[11px] text-slate-200 font-mono">
              {lightboxIndex + 1} / {screenshots.length}
            </div>

            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-3 -right-3 w-7 h-7 bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center text-slate-200 hover:bg-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Prev */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {lightboxIndex < screenshots.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function DraftReportView({
  summary,
  reproductionSteps,
  severity,
  errorType,
  screenshots,
  onSummaryChange,
  onStepsChange,
  onSeverityChange,
}: DraftReportViewProps) {
  return (
    <div className="flex-1 px-4 py-3 overflow-y-auto flex flex-col gap-2.5">
        {/* Compact meta row: Severity + Error Type */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
              Severity
            </label>
            <div className="flex gap-1">
              {severityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onSeverityChange(opt)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                    severity === opt
                      ? `${severityColors[opt]} ring-1`
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
              Error Type
            </label>
            <div className="bg-slate-900/50 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 truncate">
              {errorType || "—"}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
            Summary
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-purple)]/50 transition-colors"
          />
        </div>

        {screenshots.length > 0 && (
          <KeyFrames screenshots={screenshots} />
        )}

        {/* Reproduction Steps — primary content area */}
        <div className="flex-1 flex flex-col min-h-0">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
            Reproduction Steps
          </label>
          <textarea
            value={reproductionSteps}
            onChange={(e) => onStepsChange(e.target.value)}
            className="flex-1 min-h-[280px] w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-[var(--color-purple)]/50 transition-colors resize-none"
          />
        </div>
    </div>
  );
}
