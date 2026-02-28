import type { SeverityCount } from "@/types/session";

export interface SeverityDonutViewProps {
  totalErrors: number;
  severityCounts: SeverityCount;
}

export function SeverityDonutView({
  totalErrors,
  severityCounts,
}: SeverityDonutViewProps) {
  const { critical, high, medium, low } = severityCounts;
  const total = critical + high + medium + low;

  const criticalPct = total > 0 ? (critical / total) * 100 : 0;
  const highPct = total > 0 ? (high / total) * 100 : 0;
  const mediumPct = total > 0 ? (medium / total) * 100 : 0;

  const gradient = `conic-gradient(
    #ef4444 0% ${criticalPct}%,
    #f59e0b ${criticalPct}% ${criticalPct + highPct}%,
    #3b82f6 ${criticalPct + highPct}% ${criticalPct + highPct + mediumPct}%,
    #6b7280 ${criticalPct + highPct + mediumPct}% 100%
  )`;

  const items = [
    { color: "bg-red-500", label: "Critical", count: critical },
    { color: "bg-yellow-500", label: "High", count: high },
    { color: "bg-blue-500", label: "Medium", count: medium },
    { color: "bg-gray-500", label: "Low", count: low },
  ];

  return (
    <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] h-full">
      <p className="text-xs font-semibold text-white mb-4">Severity 분포</p>
      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <div
            className="w-24 h-24 rounded-full"
            style={{ background: gradient }}
          />
          <div className="absolute inset-3 rounded-full bg-[var(--color-dark-bg)] flex items-center justify-center">
            <span className="text-white text-sm font-bold">{totalErrors}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              <span className="text-slate-400 w-14">{item.label}</span>
              <span className="text-white font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
