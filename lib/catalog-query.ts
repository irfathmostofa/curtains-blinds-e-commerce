import type { Category, Product } from "@/lib/types";

export const PAGE_SIZE = 9;
export const PRICE_MAX = 2000;

export type CatalogQuery = {
  category?: string;
  sort?: string;
  page?: string;
  min?: string;
  max?: string;
  bestseller?: string;
};

export type CatalogResult = {
  list: Product[];
  total: number;
  page: number;
  pageCount: number;
  minPrice: number;
  maxPrice: number;
  bestsellerOnly: boolean;
};

function toNumber(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function paginateProducts(
  products: Product[],
  categories: Category[],
  query: CatalogQuery
): CatalogResult {
  const minPrice = Math.max(0, toNumber(query.min, 0));
  const maxPrice = Math.max(minPrice, toNumber(query.max, PRICE_MAX));
  const bestsellerOnly = query.bestseller === "1";

  let list = products;
  if (query.category) {
    const cat = categories.find((c) => c.slug === query.category);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }
  list = list.filter((p) => p.base_price >= minPrice && p.base_price <= maxPrice);
  if (bestsellerOnly) list = list.filter((p) => p.is_bestseller);

  if (query.sort === "price-asc") list = [...list].sort((a, b) => a.base_price - b.base_price);
  else if (query.sort === "price-desc") list = [...list].sort((a, b) => b.base_price - a.base_price);
  else if (query.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, toNumber(query.page, 1)), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return {
    list: list.slice(start, start + PAGE_SIZE),
    total,
    page,
    pageCount,
    minPrice,
    maxPrice,
    bestsellerOnly,
  };
}
