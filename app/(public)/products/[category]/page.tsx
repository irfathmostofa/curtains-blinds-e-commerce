import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { stripHtml } from "@/lib/html";
import { HtmlContent } from "@/components/html-content";

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
    description: category.seo_description || stripHtml(category.description),
    path: `/products/${category.slug}`,
    image: category.image_url,
    keywords: category.seo_keywords || `${category.name} Dubai, ${category.name} Abu Dhabi, custom ${category.name.toLowerCase()} UAE`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { sort?: string; page?: string; min?: string; max?: string; bestseller?: string };
}) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();
  const [products, categories] = await Promise.all([getProductsByCategory(category.id), getCategories()]);

  return (
    <main className="container space-y-5 py-6 md:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: category.name, path: `/products/${category.slug}` },
        ]}
      />
      <div className="space-y-3 [&_h1]:text-2xl [&_h1]:md:text-3xl">
        <SectionHeading as="h1" title={category.name} />
        <div className="max-w-3xl text-sm text-muted-foreground [&>p]:line-clamp-2">
          <HtmlContent html={category.description} />
        </div>
      </div>
      <ProductCatalog products={products} categories={categories} query={searchParams} lockedCategory={category.slug} />
    </main>
  );
}
