"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { FormBuilder } from "@/components/admin/form-builder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { EntityConfig } from "@/lib/admin/entities";
import { LeadsExport } from "@/app/admin/(dashboard)/[entity]/export-button";

export function EntityManager({
  config,
  rows,
  status,
  location,
}: {
  config: EntityConfig;
  rows: Record<string, unknown>[];
  status?: string;
  location?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q)) : rows;
  }, [rows, query]);

  function close() {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.key === "leads" ? <LeadsExport rows={rows} /> : null}
          {config.creatable ? (
            <Button
              type="button"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        {config.key === "leads" || config.key === "bookings" ? (
          <form className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2">
              Status
              <select name="status" defaultValue={status || ""} className="h-10 rounded-xl border px-3">
                <option value="">All</option>
                {(config.key === "leads"
                  ? ["new", "contacted", "converted"]
                  : ["new", "confirmed", "completed", "cancelled"]
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            {config.key === "bookings" ? (
              <label className="flex items-center gap-2">
                Location
                <select name="location" defaultValue={location || ""} className="h-10 rounded-xl border px-3">
                  <option value="">All</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                </select>
              </label>
            ) : null}
            <Button type="submit" variant="outline" size="sm">
              Filter
            </Button>
          </form>
        ) : null}
      </div>

      <DataTable
        config={config}
        rows={filtered}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
        <DialogContent className="max-w-2xl">
          <h2 className="pr-8 font-serif text-2xl">{editing ? `Edit ${config.title}` : `New ${config.title}`}</h2>
          <FormBuilder
            key={String(editing?.id || "new")}
            config={config}
            initial={editing || undefined}
            onDone={close}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
