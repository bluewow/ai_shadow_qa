export interface MetricItem {
  label: string;
  value: string;
  change: string;
  isError?: boolean;
}

export interface MetricsViewProps {
  metrics: MetricItem[];
  onErrorMetricClick?: () => void;
}

export function MetricsView({ metrics, onErrorMetricClick }: MetricsViewProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`p-5 bg-slate-800/50 border rounded-lg relative overflow-hidden ${
            metric.isError
              ? "border-red-500/50 cursor-pointer hover:border-red-500/70 transition-colors"
              : "border-slate-700"
          }`}
          onClick={metric.isError ? onErrorMetricClick : undefined}
        >
          {metric.isError && (
            <div className="absolute inset-0 border-2 border-red-500/50 bg-red-500/5 animate-pulse" />
          )}
          <p className="text-slate-400 text-xs font-medium uppercase mb-2 relative">
            {metric.label}
          </p>
          <p
            className={`text-2xl font-semibold relative ${
              metric.isError ? "text-red-400" : "text-white"
            }`}
          >
            {metric.value}
          </p>
          <p
            className={`text-xs mt-2 relative ${
              metric.isError
                ? "text-red-500 font-bold underline"
                : metric.change.startsWith("+")
                  ? "text-green-500"
                  : "text-slate-400"
            }`}
          >
            {metric.change}
          </p>
        </div>
      ))}
    </div>
  );
}
