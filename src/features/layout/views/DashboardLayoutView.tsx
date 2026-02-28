import type { ReactNode } from "react";

export interface DashboardLayoutViewProps {
  header: ReactNode;
  flowBar?: ReactNode;
  content: ReactNode;
  statusBar: ReactNode;
}

export function DashboardLayoutView({
  header,
  flowBar,
  content,
  statusBar,
}: DashboardLayoutViewProps) {
  return (
    <div className="h-screen flex flex-col font-sans">
      {header}
      {flowBar}
      <main className="flex-1 flex overflow-hidden">{content}</main>
      {statusBar}
    </div>
  );
}
