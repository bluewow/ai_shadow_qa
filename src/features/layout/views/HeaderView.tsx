import { Zap } from "lucide-react";

export type TabName = "Dashboard" | "Active Session" | "History";

export interface HeaderViewProps {
  isRecording: boolean;
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export function HeaderView({
  isRecording,
  activeTab,
  onTabChange,
}: HeaderViewProps) {
  const isConnected = isRecording;
  const tabs: TabName[] = ["Dashboard", "Active Session", "History"];

  return (
    <header className="h-14 border-b border-[var(--color-glass-border)] flex items-center justify-between px-6 bg-[var(--color-dark-bg)]/50 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-purple)] rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold tracking-tight text-white uppercase text-sm">
          AI Shadow QA{" "}
          <span className="text-slate-500 font-normal">Demo</span>
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-400">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-0.5 transition-colors ${
                tab === activeTab
                  ? "text-slate-100 border-b-2 border-[var(--color-purple)] cursor-default"
                  : "hover:text-slate-100 cursor-pointer border-b-2 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                : "bg-slate-500"
            }`}
          />
          <span className="text-xs font-medium uppercase tracking-widest text-slate-300">
            {isConnected ? "Live Engine" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
