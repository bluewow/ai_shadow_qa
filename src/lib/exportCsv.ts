import type { SessionRecord } from "@/types/session";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportSessionsCsv(sessions: SessionRecord[]): void {
  const headers = ["Date", "ID", "Severity", "Error Type", "Summary", "Reproduction Steps"];
  const rows = sessions.map((s) => [
    escapeCsv(s.date),
    escapeCsv(s.simpleId),
    escapeCsv(s.maxSeverity),
    escapeCsv(s.errorType),
    escapeCsv(s.summary),
    escapeCsv(s.reproductionSteps),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `shadow-qa-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
