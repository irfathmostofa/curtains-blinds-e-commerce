"use client";

import { Button } from "@/components/ui/button";
import type { EntityConfig } from "@/lib/admin/entities";

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
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-t">
                {config.columns.map((col) => (
                  <td key={col.key} className="max-w-[220px] truncate px-4 py-3">
                    {String(row[col.key] ?? "")}
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
        {rows.map((row) => (
          <li key={String(row.id)} className="rounded-2xl border bg-card p-4">
            <dl className="space-y-2 text-sm">
              {config.columns.map((col) => (
                <div key={col.key} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{col.label}</dt>
                  <dd className="truncate font-medium">{String(row[col.key] ?? "")}</dd>
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
