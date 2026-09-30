"use client";

import { Button } from "@/components/ui/button";
import type { EntityConfig } from "@/lib/admin/entities";

function displayValue(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return String(value);
}

export function DataTable({
  config,
  rows,
  onEdit,
}: {
  config: EntityConfig;
  rows: Record<string, unknown>[];
  onEdit: (row: Record<string, unknown>) => void;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              {config.columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={String(row.id || row.slug || i)} className="border-t">
                {config.columns.map((col) => (
                  <td key={col.key} className="max-w-[220px] truncate px-4 py-3">
                    {displayValue(row[col.key])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(row)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="p-6 text-sm text-muted-foreground">No rows.</p> : null}
      </div>
      <ul className="grid gap-3 md:hidden">
        {rows.map((row, i) => (
          <li key={String(row.id || row.slug || i)} className="rounded-2xl border bg-card p-4">
            <dl className="space-y-2 text-sm">
              {config.columns.map((col) => (
                <div key={col.key} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{col.label}</dt>
                  <dd className="truncate font-medium">{displayValue(row[col.key])}</dd>
                </div>
              ))}
            </dl>
            <Button type="button" variant="outline" size="sm" className="mt-4 w-full" onClick={() => onEdit(row)}>
              Edit
            </Button>
          </li>
        ))}
        {!rows.length ? <li className="p-6 text-sm text-muted-foreground">No rows.</li> : null}
      </ul>
    </>
  );
}
