"use client";

import { Button } from "@/components/ui/button";

export function LeadsExport({ rows }: { rows: Record<string, unknown>[] }) {
  function exportCsv() {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button type="button" variant="outline" onClick={exportCsv}>
      Export CSV
    </Button>
  );
}
