import type { ReactNode } from "react";

export interface HistoryContentViewProps {
  sessionList: ReactNode;
  sessionDetail: ReactNode;
}

export function HistoryContentView({
  sessionList,
  sessionDetail,
}: HistoryContentViewProps) {
  return (
    <div className="w-full bg-[var(--color-dark-bg)] flex h-full">
      {sessionList}
      {sessionDetail}
    </div>
  );
}
