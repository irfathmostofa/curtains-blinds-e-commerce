import { notFound } from "next/navigation";
import { FormBuilder } from "@/components/admin/form-builder";
import { entities } from "@/lib/admin/entities";
import { getStore } from "@/lib/data/store";

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

export const dynamic = "force-dynamic";

export default function EditEntityPage({ params }: { params: { entity: string; id: string } }) {
  const config = entities[slugMap[params.entity]];
  if (!config) notFound();
  const store = getStore();
  const rows = store[config.storeKey] as unknown as { id: string }[];
  const row = rows.find((r) => r.id === params.id);
  if (!row) notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-3xl">Edit {config.title.slice(0, -1)}</h1>
      <FormBuilder config={config} initial={row as Record<string, unknown>} />
    </main>
  );
}
