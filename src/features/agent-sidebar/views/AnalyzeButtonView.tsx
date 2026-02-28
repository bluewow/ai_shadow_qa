import { Zap, RotateCcw, SlidersHorizontal, CheckCircle } from "lucide-react";
import type { AgentStatus, FlowStep, SidebarTab } from "@/types/agent";

export interface AnalyzeButtonViewProps {
  status: AgentStatus;
  sidebarTab: SidebarTab;
  hasReport: boolean;
  flowStep: FlowStep;
  onAnalyze: () => void;
}

export function AnalyzeButtonView({
  status,
  sidebarTab,
  hasReport,
  flowStep,
  onAnalyze,
}: AnalyzeButtonViewProps) {
  const isAnalyzing = status === "analyzing";
  const isDisabled = status === "idle";
  const isSelecting = flowStep === "selecting";

  // Report tab: "분석 완료" + "RE-ANALYZE" side by side
  if (sidebarTab === "report" && hasReport) {
    return (
      <div className="p-3 border-t border-[var(--color-glass-border)] shrink-0 flex gap-2">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("draft-report-send"))}
          className="flex-1 py-2.5 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 bg-white text-black hover:bg-slate-200"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          분석 완료
        </button>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`flex-1 py-2.5 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            isAnalyzing
              ? "bg-yellow-600/20 text-yellow-400 animate-pulse cursor-wait"
              : "bg-[var(--color-purple)]/20 text-[var(--color-purple)] hover:bg-[var(--color-purple)]/30 border border-[var(--color-purple)]/30"
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {isAnalyzing ? "ANALYZING..." : "RE-ANALYZE"}
        </button>
      </div>
    );
  }

  // Selecting state — show hint
  if (isSelecting) {
    return (
      <div className="p-3 border-t border-[var(--color-glass-border)] shrink-0">
        <div className="w-full py-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-purple)]" />
          화면 좌측에서 분석 범위를 선택하세요
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-[var(--color-glass-border)] shrink-0">
      <button
        onClick={onAnalyze}
        disabled={isDisabled || isAnalyzing}
        className={`w-full py-3.5 text-white font-bold rounded-lg transition-all transform flex items-center justify-center gap-3 ${
          isAnalyzing
            ? "bg-gradient-to-r from-yellow-600 to-yellow-700 animate-pulse cursor-wait"
            : isDisabled
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:to-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.98]"
        }`}
      >
        <Zap className="h-5 w-5" />
        {isAnalyzing ? "ANALYZING..." : "ANALYZE ERROR"}
      </button>
    </div>
  );
}
