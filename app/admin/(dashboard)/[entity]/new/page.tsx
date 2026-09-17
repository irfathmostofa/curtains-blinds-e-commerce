import { notFound } from "next/navigation";
import { FormBuilder } from "@/components/admin/form-builder";
import { entities } from "@/lib/admin/entities";

const slugMap: Record<string, string> = {
  products: "products",
  categories: "categories",
  testimonials: "testimonials",
  blog: "posts",
  faqs: "faqs",
  partners: "partners",
  users: "users",
};

export default function NewEntityPage({ params }: { params: { entity: string } }) {
  const config = entities[slugMap[params.entity]];
  if (!config?.creatable) notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-3xl">New {config.title.slice(0, -1)}</h1>
      <FormBuilder config={config} />
    </main>
  );
}
