import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { ProductPagination } from "@/components/product-pagination";
import { PAGE_SIZE, paginateProducts, type CatalogQuery } from "@/lib/catalog-query";
import type { Category, Product } from "@/lib/types";

export function ProductCatalog({
  products,
  categories,
  query,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  query: CatalogQuery;
  lockedCategory?: string;
}) {
  const result = paginateProducts(products, categories, {
    ...query,
    category: lockedCategory || query.category,
  });
  const counts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.slug] = products.filter((p) => p.category_id === c.id).length;
    return acc;
  }, {});

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-8">
      <ProductFilters
        categories={categories}
        counts={counts}
        total={products.length}
        lockedCategory={lockedCategory}
      />
      <div className="min-w-0 space-y-4">
        {result.list.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {result.list.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            No products match these filters.{" "}
            <Link href="/products" className="text-accent underline-offset-4 hover:underline">
              Clear filters
            </Link>
            .
          </p>
        )}
        <ProductPagination page={result.page} pageCount={result.pageCount} total={result.total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
