import { useState } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { SessionRecord } from "@/types/session";
import type { LogLevel } from "@/types/agent";

export interface SessionDetailViewProps {
  session: SessionRecord;
}

const severityBadge: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500",
  high: "bg-yellow-500/10 text-yellow-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-gray-500/10 text-gray-400",
};

const statusBadge: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-500",
  in_progress: "bg-blue-500/10 text-blue-400",
};

const logLevelColor: Record<LogLevel, string> = {
  INFO: "text-slate-400",
  SCAN: "text-[var(--color-purple)]",
  ACT: "text-[var(--color-purple)]",
  OBS: "text-[var(--color-purple)]",
  WARN: "text-yellow-500",
  ERROR: "text-red-500",
  ANALYSIS: "text-red-400",
};

export function SessionDetailView({ session }: SessionDetailViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const screenshots = session.screenshots ?? [];
  const isLightboxOpen = lightboxIndex !== null;

  return (
    <div className="w-[55%] p-4 overflow-y-auto space-y-4">
      {/* Session Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">
              {session.simpleId}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                severityBadge[session.maxSeverity]
              }`}
            >
              {session.maxSeverity}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] capitalize ${
                statusBadge[session.status]
              }`}
            >
              {session.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {session.date}
            {session.duration && ` · Duration: ${session.duration}`}
            {session.tokenUsage != null && ` · Token: ${session.tokenUsage}k`}
          </p>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-[10px] text-slate-400 border border-[var(--color-glass-border)] hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1">
          Notion
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Draft Report */}
      <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Draft Report
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-400 mb-1">Summary</p>
            <p className="text-xs text-white font-medium leading-relaxed">
              {session.summary}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 mb-1">
              Reproduction Steps
            </p>
            <div className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-line">
              {session.reproductionSteps}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 mb-1">Error Type</p>
            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-mono">
              {session.errorType}
            </span>
          </div>
        </div>
      </div>

      {/* Key Frame Screenshots */}
      {session.screenshots && session.screenshots.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Key Frames
            </p>
            <span className="text-[10px] text-slate-500">
              {session.screenshots.length} captures
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {session.screenshots.map((base64, i) => (
              <img
                key={i}
                src={`data:image/jpeg;base64,${base64}`}
                alt={`Key frame ${i + 1}`}
                className="h-28 w-auto rounded border border-white/10 shrink-0 object-cover cursor-pointer hover:border-white/30 transition-colors"
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Agent Log Timeline */}
      {session.logs && session.logs.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Agent Log Timeline
            </p>
            <span className="text-[10px] text-slate-500">
              {session.logs.length} entries
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            {session.logs.map((log, i) => (
              <p key={i} className="text-slate-400">
                [{log.timestamp}]{" "}
                <span className={logLevelColor[log.level]}>{log.level}</span>{" "}
                <span
                  className={
                    log.level === "ERROR" ? "text-red-400" : "text-slate-400"
                  }
                >
                  {log.message}
                </span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          {screenshots.length > 1 && (
            <button
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : 0
                );
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <img
            src={`data:image/jpeg;base64,${screenshots[lightboxIndex]}`}
            alt={`Key frame ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {screenshots.length > 1 && (
            <button
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null ? (prev + 1) % screenshots.length : 0
                );
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 text-xs text-slate-400">
            {lightboxIndex + 1} / {screenshots.length}
          </p>
        </div>
      )}
    </div>
  );
}
