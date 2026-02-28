"use client";

import { useTestApp } from "../assets/useTestApp";
import { TestAppView } from "../views/TestAppView";
import { MetricsView } from "../views/MetricsView";
import { TransactionTableView } from "../views/TransactionTableView";

export function TestApp() {
  const {
    metrics,
    transactions,
    handleErrorMetricClick,
    handleFailedRowClick,
    handleExportClick,
    handleSettingsClick,
  } = useTestApp();

  return (
    <TestAppView
      metrics={
        <MetricsView
          metrics={metrics}
          onErrorMetricClick={handleErrorMetricClick}
        />
      }
      transactionTable={
        <TransactionTableView
          transactions={transactions}
          onFailedRowClick={handleFailedRowClick}
        />
      }
      onExportClick={handleExportClick}
      onSettingsClick={handleSettingsClick}
    />
  );
}
