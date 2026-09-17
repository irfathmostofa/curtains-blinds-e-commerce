import Link from "next/link";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { entities } from "@/lib/admin/entities";
import { getStore } from "@/lib/data/store";
import { LeadsExport } from "./export-button";

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
    <main className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex gap-2">
          {config.key === "leads" ? <LeadsExport rows={rows} /> : null}
          {config.creatable ? (
            <Button asChild>
              <Link href={`/admin/${params.entity}/new`}>Add</Link>
            </Button>
          ) : null}
        </div>
      </div>
      {config.key === "leads" || config.key === "bookings" ? (
        <form className="flex flex-wrap gap-3 text-sm">
          <label>
            Status
            <select name="status" defaultValue={searchParams.status || ""} className="ml-2 h-10 rounded-xl border px-3">
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
            <label>
              Location
              <select name="location" defaultValue={searchParams.location || ""} className="ml-2 h-10 rounded-xl border px-3">
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
      <DataTable config={config} rows={rows} filter={searchParams.q} />
    </main>
  );
}
