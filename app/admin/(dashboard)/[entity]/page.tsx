import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/entity-manager";
import { entities, slugMap } from "@/lib/admin/entities";
import { requireAdminPage } from "@/lib/admin/guard";
import { loadEntityRows } from "@/lib/admin/load";
import { getCategories } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

function inDateRange(value: unknown, from?: string, to?: string) {
  if (!from && !to) return true;
  const raw = typeof value === "string" ? value : "";
  if (!raw) return false;
  const time = new Date(raw).getTime();
  if (Number.isNaN(time)) return false;
  if (from) {
    const start = new Date(`${from}T00:00:00`).getTime();
    if (time < start) return false;
  }
  if (to) {
    const end = new Date(`${to}T23:59:59.999`).getTime();
    if (time > end) return false;
  }
  return true;
}

export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: { entity: string };
  searchParams: { q?: string; status?: string; location?: string; from?: string; to?: string };
}) {
  const key = slugMap[params.entity];
  const config = key ? entities[key] : undefined;
  if (!config) notFound();
  await requireAdminPage(`/admin/${params.entity}`);

  const [rows, categories] = await Promise.all([loadEntityRows(config.key), getCategories()]);
  let list = rows;
  if (searchParams.status) list = list.filter((r) => r.status === searchParams.status);
  if (searchParams.location) list = list.filter((r) => r.location === searchParams.location);
  if (searchParams.from || searchParams.to) {
    list = list.filter((r) => inDateRange(r.created_at, searchParams.from, searchParams.to));
  }

  return (
    <EntityManager
      config={config}
      rows={list}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      status={searchParams.status}
      location={searchParams.location}
      from={searchParams.from}
      to={searchParams.to}
    />
  );
}
