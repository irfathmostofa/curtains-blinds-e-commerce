import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/site";
import { getStore } from "@/lib/data/store";
import type {
  BlogPost,
  Booking,
  Category,
  CmsPage,
  Faq,
  Lead,
  Partner,
  Product,
  ProductVariant,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

function hydrate(product: Product, categories: Category[], variants: ProductVariant[]): Product {
  return {
    ...product,
    category: categories.find((c) => c.id === product.category_id),
    variants: variants.filter((v) => v.product_id === product.id),
  };
}

async function fromSupabase<T>(fn: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    const supabase = createClient();
    if (!supabase) return fallback;
    const data = await fn();
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return (data as Category[] | null)?.length ? (data as Category[]) : null;
  }, getStore().categories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  const categories = await getCategories();
  const variants = await getVariants();
  const products = await fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    return (data as Product[] | null)?.length ? (data as Product[]) : null;
  }, getStore().products.filter((p) => p.is_active));
  return products.map((p) => hydrate(p, categories, variants));
}

export async function getVariants(): Promise<ProductVariant[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("product_variants").select("*");
    return (data as ProductVariant[] | null)?.length ? (data as ProductVariant[]) : null;
  }, getStore().variants);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category_id === categoryId);
}

export async function getBestsellers(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_bestseller);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, limit);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });
    return (data as Testimonial[] | null)?.length ? (data as Testimonial[]) : null;
  }, getStore().testimonials.filter((t) => t.is_featured));
}

export async function getPartners(): Promise<Partner[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("partners").select("*").order("sort_order");
    return (data as Partner[] | null)?.length ? (data as Partner[]) : null;
  }, getStore().partners);
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  const all = await fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    return (data as Faq[] | null)?.length ? (data as Faq[]) : null;
  }, getStore().faqs);
  return category ? all.filter((f) => f.category === category) : all;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    return (data as BlogPost[] | null)?.length ? (data as BlogPost[]) : null;
  }, getStore().posts);
  return posts.filter((p) => p.published_at);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getCmsPage(slug: string): Promise<CmsPage | undefined> {
  const pages = await fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("cms_pages").select("*");
    return (data as CmsPage[] | null)?.length ? (data as CmsPage[]) : null;
  }, getStore().pages);
  return pages.find((p) => p.slug === slug);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("site_settings").select("key, value");
    if (!data?.length) return null;
    const map = Object.fromEntries(data.map((row: { key: string; value: unknown }) => [row.key, row.value]));
    return {
      ...DEFAULT_SETTINGS,
      ...(typeof map.general === "object" && map.general ? map.general : {}),
      nav_links: (map.nav_links as SiteSettings["nav_links"]) || DEFAULT_SETTINGS.nav_links,
      locations: (map.locations as SiteSettings["locations"]) || DEFAULT_SETTINGS.locations,
      social_links: (map.social_links as SiteSettings["social_links"]) || DEFAULT_SETTINGS.social_links,
      trust: (map.trust as SiteSettings["trust"]) || DEFAULT_SETTINGS.trust,
    } as SiteSettings;
  }, getStore().settings);
}

export async function getLeads(): Promise<Lead[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    return (data as Lead[] | null) ?? null;
  }, getStore().leads);
}

export async function getBookings(): Promise<Booking[]> {
  return fromSupabase(async () => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    return (data as Booking[] | null) ?? null;
  }, getStore().bookings);
}

export function getRecentlyViewedSlugs(): string[] {
  try {
    const raw = cookies().get("recently_viewed_products")?.value;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    return [];
  }
}

export async function getRecentlyViewedProducts(): Promise<Product[]> {
  const slugs = getRecentlyViewedSlugs();
  if (!slugs.length) return [];
  const products = await getProducts();
  return slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}
