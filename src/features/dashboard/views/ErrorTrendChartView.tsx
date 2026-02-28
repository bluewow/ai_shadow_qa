import type { DailyErrorTrend } from "@/types/session";

export interface ErrorTrendChartViewProps {
  data: DailyErrorTrend[];
}

export function ErrorTrendChartView({ data }: ErrorTrendChartViewProps) {
  const maxTotal = Math.max(
    ...data.map((d) => d.critical + d.high + d.medium)
  );

  return (
    <div className="p-4 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-white">Error Trend (7일)</p>
        <div className="flex gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-red-500 rounded-sm" />
            Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-yellow-500 rounded-sm" />
            High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-blue-500 rounded-sm" />
            Medium
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-32">
        {data.map((item) => {
          const total = item.critical + item.high + item.medium;
          const scale = maxTotal > 0 ? total / maxTotal : 0;
          const criticalH = maxTotal > 0 ? (item.critical / maxTotal) * 100 : 0;
          const highH = maxTotal > 0 ? (item.high / maxTotal) * 100 : 0;
          const mediumH = maxTotal > 0 ? (item.medium / maxTotal) * 100 : 0;
          const isToday = item.day === "Today";

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end"
            >
              <div
                className="w-full flex flex-col gap-0.5 transition-all"
                style={{ height: `${scale * 100}%` }}
              >
                <div
                  className="w-full bg-red-500/70 rounded-sm flex-shrink-0"
                  style={{ height: `${criticalH}%`, minHeight: item.critical > 0 ? "3px" : "0" }}
                />
                <div
                  className="w-full bg-yellow-500/60 rounded-sm flex-shrink-0"
                  style={{ height: `${highH}%`, minHeight: item.high > 0 ? "3px" : "0" }}
                />
                <div
                  className="w-full bg-blue-500/40 rounded-sm flex-shrink-0"
                  style={{ height: `${mediumH}%`, minHeight: item.medium > 0 ? "3px" : "0" }}
                />
              </div>
              <span
                className={`text-[9px] mt-1 ${
                  isToday ? "text-white font-bold" : "text-slate-500"
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
