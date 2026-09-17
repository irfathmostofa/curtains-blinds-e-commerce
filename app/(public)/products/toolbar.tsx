"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

export function ProductsToolbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/products?${next.toString()}`);
  }

  return (
    <form className="flex flex-wrap gap-3" aria-label="Product filters">
      <label className="text-sm">
        Category
        <select
          className="ml-2 h-10 rounded-xl border bg-card px-3"
          defaultValue={params.get("category") || ""}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Sort
        <select
          className="ml-2 h-10 rounded-xl border bg-card px-3"
          defaultValue={params.get("sort") || ""}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </form>
  );
}
