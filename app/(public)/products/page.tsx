import { SectionHeading } from "@/components/section-heading";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCatalog } from "@/components/product-catalog";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Curtains, Blinds & Motorized Collections",
  description:
    "Browse made-to-measure curtains, blinds and motorised window treatments. Filter by category and sort by price.",
  path: "/products",
  keywords:
    "buy curtains Dubai, custom blinds UAE, motorized tracks Dubai, blackout drapes, sheer curtains, roller blinds Dubai",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; page?: string; min?: string; max?: string; bestseller?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="container space-y-5 py-6 md:py-8">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <div className="[&_h1]:text-2xl [&_h1]:md:text-3xl [&_.max-w-2xl]:max-w-xl">
        <SectionHeading as="h1" eyebrow="Shop" title="Collections" subtitle="Every piece is made to your drop, width and lining." />
      </div>
      <ProductCatalog products={products} categories={categories} query={searchParams} />
    </main>
  );
}
