import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { ProductsToolbar } from "./toolbar";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Curtains, Blinds & Motorized Collections",
  description:
    "Browse made-to-measure curtains, blinds and motorised window treatments. Filter by category and sort by price.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  let list = products;
  if (searchParams.category) {
    const cat = categories.find((c) => c.slug === searchParams.category);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }
  if (searchParams.sort === "price-asc") list = [...list].sort((a, b) => a.base_price - b.base_price);
  if (searchParams.sort === "price-desc") list = [...list].sort((a, b) => b.base_price - a.base_price);

  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <Reveal>
        <SectionHeading as="h1" eyebrow="Shop" title="Collections" subtitle="Every piece is made to your drop, width and lining." />
      </Reveal>
      <ProductsToolbar categories={categories} />
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>
      {!list.length ? (
        <p>
          No products match these filters. <Link href="/products">Clear filters</Link>.
        </p>
      ) : null}
    </main>
  );
}
