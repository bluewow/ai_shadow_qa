import type { FlowStep } from "@/types/agent";

export interface FlowBarViewProps {
  flowStep: FlowStep;
}

const steps: { key: FlowStep; label: string; icon: string }[] = [
  { key: "capturing", label: "캡처", icon: "🖥️" },
  { key: "selecting", label: "범위선택", icon: "🎯" },
  { key: "analyzing", label: "분석", icon: "⚡" },
  { key: "report", label: "리포트", icon: "📋" },
  { key: "sent", label: "전송", icon: "🚀" },
];

function getStepIndex(flowStep: FlowStep): number {
  const idx = steps.findIndex((s) => s.key === flowStep);
  return idx === -1 ? -1 : idx;
}

export function FlowBarView({ flowStep }: FlowBarViewProps) {
  if (flowStep === "idle") return null;

  const activeIndex = getStepIndex(flowStep);

  return (
    <div className="flex items-center px-6 py-2.5 border-b border-[var(--color-glass-border)] bg-[var(--color-dark-bg)]/30">
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        const isPending = i > activeIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* Connector line */}
            {i > 0 && (
              <div className="w-8 h-[2px] mx-1 rounded-full overflow-hidden bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isDone || isActive
                      ? "w-full bg-[var(--color-purple)]"
                      : "w-0 bg-transparent"
                  }`}
                />
              </div>
            )}

            {/* Step node */}
            <div className="flex items-center gap-1.5 relative">
              {/* Pulse ring for active step */}
              {isActive && (
                <span className="absolute -inset-1 rounded-lg bg-[var(--color-purple)]/10 flow-pulse" />
              )}

              <span
                className={`relative z-10 text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all duration-300 flex items-center gap-1 ${
                  isActive
                    ? "bg-[var(--color-purple)]/25 text-[var(--color-purple-light)] ring-1 ring-[var(--color-purple)]/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : isDone
                      ? "bg-green-500/15 text-green-400"
                      : "text-slate-500 bg-slate-800/50"
                }`}
              >
                {isDone ? "✓" : step.icon}
                <span className={isPending ? "opacity-50" : ""}>{step.label}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
