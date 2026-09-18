import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/entity-manager";
import { entities } from "@/lib/admin/entities";
import { getStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

const slugMap: Record<string, string> = {
  products: "products",
  categories: "categories",
  leads: "leads",
  bookings: "bookings",
  testimonials: "testimonials",
  blog: "posts",
  faqs: "faqs",
  partners: "partners",
  users: "users",
};

export default function EntityListPage({
  params,
  searchParams,
}: {
  params: { entity: string };
  searchParams: { q?: string; status?: string; location?: string };
}) {
  const key = slugMap[params.entity];
  const config = key ? entities[key] : undefined;
  if (!config) notFound();
  const store = getStore();
  let rows = store[config.storeKey] as unknown as Record<string, unknown>[];
  if (searchParams.status) rows = rows.filter((r) => r.status === searchParams.status);
  if (searchParams.location) rows = rows.filter((r) => r.location === searchParams.location);

  return (
    <EntityManager config={config} rows={rows} status={searchParams.status} location={searchParams.location} />
  );
}
