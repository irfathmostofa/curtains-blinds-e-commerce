import { ProductCard } from "@/components/product-card";
import { getRecentlyViewedProducts } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const recent = (await getRecentlyViewedProducts()).filter((p) => p.id !== excludeId).slice(0, 3);
  if (!recent.length) return null;
  return (
    <section className="container space-y-6 py-10">
      <h2 className="font-serif text-3xl">Recently viewed</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
