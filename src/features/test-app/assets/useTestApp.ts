"use client";

import { useCallback } from "react";
import type { MetricItem } from "../views/MetricsView";
import type { Transaction } from "../views/TransactionTableView";
import { useAgentStore } from "@/features/agent-sidebar/assets/useAgentStore";

const MOCK_METRICS: MetricItem[] = [
  {
    label: "Total Revenue",
    value: "$124,592.00",
    change: "+12.5% from last month",
  },
  {
    label: "Active Cart Sessions",
    value: "1,482",
    change: "Currently being tracked",
  },
  {
    label: "Checkout Success",
    value: "84.2%",
    change: "Critical Drop Detected",
    isError: true,
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    orderId: "#ORD-9021",
    customer: "Alex Rivera",
    status: "paid",
    amount: "$299.00",
  },
  {
    orderId: "#ORD-9022",
    customer: "Jordan Smith",
    status: "failed",
    amount: "$145.00",
  },
  {
    orderId: "#ORD-9023",
    customer: "Casey Jones",
    status: "pending",
    amount: "$540.00",
  },
  {
    orderId: "#ORD-9024",
    customer: "Morgan Lee",
    status: "paid",
    amount: "$89.00",
  },
  {
    orderId: "#ORD-9025",
    customer: "Taylor Kim",
    status: "failed",
    amount: "$312.00",
  },
];

export function useTestApp() {
  const { addLog } = useAgentStore();

  const handleErrorMetricClick = useCallback(() => {
    addLog("ACT", "User clicked error metric: Checkout Success 84.2%");
    addLog("OBS", "Checkout success rate dropped below threshold (90%)");
    addLog("WARN", "Potential payment gateway timeout detected");
  }, [addLog]);

  const handleFailedRowClick = useCallback(
    (orderId: string) => {
      addLog("ACT", `User clicked failed transaction: ${orderId}`);
      addLog(
        "ERROR",
        `Exception: 'TypeError: Cannot read property 'id' of null' in PaymentForm.tsx:124`
      );
      addLog(
        "ANALYSIS",
        "Checkout state mismatch during payment validation step"
      );
    },
    [addLog]
  );

  const handleExportClick = useCallback(() => {
    addLog("ACT", "User clicked Export CSV button");
    addLog("OBS", "Export dialog opened");
  }, [addLog]);

  const handleSettingsClick = useCallback(() => {
    addLog("ACT", "User clicked Settings button");
    addLog("OBS", "Settings panel opened");
  }, [addLog]);

  return {
    metrics: MOCK_METRICS,
    transactions: MOCK_TRANSACTIONS,
    handleErrorMetricClick,
    handleFailedRowClick,
    handleExportClick,
    handleSettingsClick,
  };
}
