import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/entity-manager";
import { entities, slugMap } from "@/lib/admin/entities";
import { loadEntityRows } from "@/lib/admin/load";
import { getCategories } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: { entity: string };
  searchParams: { q?: string; status?: string; location?: string };
}) {
  const key = slugMap[params.entity];
  const config = key ? entities[key] : undefined;
  if (!config) notFound();

  const [rows, categories] = await Promise.all([loadEntityRows(config.key), getCategories()]);
  let list = rows;
  if (searchParams.status) list = list.filter((r) => r.status === searchParams.status);
  if (searchParams.location) list = list.filter((r) => r.location === searchParams.location);

  return (
    <EntityManager
      config={config}
      rows={list}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      status={searchParams.status}
      location={searchParams.location}
    />
  );
}
