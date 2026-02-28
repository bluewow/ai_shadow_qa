import type { ReactNode } from "react";

export interface TestAppViewProps {
  metrics: ReactNode;
  transactionTable: ReactNode;
  onExportClick?: () => void;
  onSettingsClick?: () => void;
}

export function TestAppView({
  metrics,
  transactionTable,
  onExportClick,
  onSettingsClick,
}: TestAppViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            E-Commerce Insights
          </h1>
          <p className="text-slate-400 text-sm">
            Operational Dashboard &bull; Preview Mode
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExportClick}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={onSettingsClick}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>
      {metrics}
      {transactionTable}
    </div>
  );
}
