"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { EntityConfig } from "@/lib/admin/entities";

export function DataTable({
  config,
  rows,
  filter,
}: {
  config: EntityConfig;
  rows: Record<string, unknown>[];
  filter?: string;
}) {
  const filtered = filter
    ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(filter.toLowerCase()))
    : rows;

  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left">
          <tr>
            {config.columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={String(row.id)} className="border-t">
              {config.columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {String(row[col.key] ?? "")}
                </td>
              ))}
              <td className="px-4 py-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={`${config.href}/${row.id}`}>Edit</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length ? <p className="p-6 text-sm text-muted-foreground">No rows.</p> : null}
    </div>
  );
}
