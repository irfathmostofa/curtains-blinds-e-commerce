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
  categories = [],
  status,
  location,
}: {
  config: EntityConfig;
  rows: Record<string, unknown>[];
  categories?: { id: string; name: string }[];
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
              className="w-full sm:w-auto"
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
          <form className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
              Status
              <select name="status" defaultValue={status || ""} className="h-10 min-w-0 flex-1 rounded-xl border px-3 sm:w-auto">
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
              <label className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
                Location
                <select name="location" defaultValue={location || ""} className="h-10 min-w-0 flex-1 rounded-xl border px-3 sm:w-auto">
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
        <DialogContent className="max-h-[92dvh] w-[min(96vw,52rem)] max-w-3xl overflow-y-auto p-4 sm:p-6">
          <h2 className="pr-8 font-serif text-2xl">{editing ? `Edit ${config.title}` : `New ${config.title}`}</h2>
          <FormBuilder
            key={String(editing?.id || "new")}
            config={config}
            initial={editing || undefined}
            categories={categories}
            onDone={close}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
