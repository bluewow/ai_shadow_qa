import type { ReactNode } from "react";

export interface ActiveSessionContentViewProps {
  screenFeed: ReactNode;
  agentSidebar: ReactNode;
}

export function ActiveSessionContentView({
  screenFeed,
  agentSidebar,
}: ActiveSessionContentViewProps) {
  return (
    <>
      <section className="w-[55%] bg-slate-950 overflow-hidden border-r border-[var(--color-glass-border)]">
        {screenFeed}
      </section>
      <aside className="w-[45%] bg-[var(--color-dark-bg)] flex flex-col h-full">
        {agentSidebar}
      </aside>
    </>
  );
}
