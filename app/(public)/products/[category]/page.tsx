import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);
  if (!category) return {};
  return buildMetadata({
    title: category.seo_title || category.name,
    description: category.seo_description || category.description,
    path: `/products/${category.slug}`,
    image: category.image_url,
  });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();
  const products = await getProductsByCategory(category.id);

  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: category.name, path: `/products/${category.slug}` },
        ]}
      />
      <SectionHeading as="h1" title={category.name} subtitle={category.description} />
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </main>
  );
}
