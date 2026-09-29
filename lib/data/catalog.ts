import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, mergeHomepage } from "@/lib/site";
import type {
  BlogPost,
  Booking,
  Category,
  ChatLead,
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

async function queryRows<T>(fn: (client: NonNullable<ReturnType<typeof createClient>>) => Promise<T[] | null>): Promise<T[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    const data = await fn(supabase);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return data as Category[] | null;
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}

export async function getProducts(opts?: { includeInactive?: boolean }): Promise<Product[]> {
  const categories = await getCategories();
  const variants = await getVariants();
  const includeInactive = Boolean(opts?.includeInactive);
  const products = await queryRows(async (supabase) => {
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!includeInactive) query = query.eq("is_active", true);
    const { data } = await query;
    return data as Product[] | null;
  });
  return products.map((p) => hydrate(p, categories, variants));
}

export async function getVariants(): Promise<ProductVariant[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("product_variants").select("*");
    return data as ProductVariant[] | null;
  });
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

export async function getTestimonials(opts?: { includeHidden?: boolean }): Promise<Testimonial[]> {
  const includeHidden = Boolean(opts?.includeHidden);
  return queryRows(async (supabase) => {
    let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (!includeHidden) query = query.eq("is_featured", true);
    const { data } = await query;
    return data as Testimonial[] | null;
  });
}

export async function getPartners(): Promise<Partner[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("partners").select("*").order("sort_order");
    return data as Partner[] | null;
  });
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  const all = await queryRows(async (supabase) => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    return data as Faq[] | null;
  });
  return category ? all.filter((f) => f.category === category) : all;
}

export async function getBlogPosts(opts?: { includeDrafts?: boolean }): Promise<BlogPost[]> {
  const includeDrafts = Boolean(opts?.includeDrafts);
  const posts = await queryRows(async (supabase) => {
    let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    if (!includeDrafts) query = query.not("published_at", "is", null);
    const { data } = await query;
    return data as BlogPost[] | null;
  });
  return includeDrafts ? posts : posts.filter((p) => p.published_at);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getCmsPage(slug: string): Promise<CmsPage | undefined> {
  const pages = await getCmsPages();
  return pages.find((p) => p.slug === slug);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  if (!supabase) return { ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) };
  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    if (!data?.length) return { ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) };
    const map = Object.fromEntries(data.map((row: { key: string; value: unknown }) => [row.key, row.value]));
    return {
      ...DEFAULT_SETTINGS,
      ...(typeof map.general === "object" && map.general ? map.general : {}),
      nav_links: (map.nav_links as SiteSettings["nav_links"]) || DEFAULT_SETTINGS.nav_links,
      locations: (map.locations as SiteSettings["locations"]) || DEFAULT_SETTINGS.locations,
      social_links: (map.social_links as SiteSettings["social_links"]) || DEFAULT_SETTINGS.social_links,
      trust: (map.trust as SiteSettings["trust"]) || DEFAULT_SETTINGS.trust,
      seo: { ...DEFAULT_SETTINGS.seo, ...((map.seo as SiteSettings["seo"]) || {}) },
      gtm_id: (map.general as SiteSettings | undefined)?.gtm_id || DEFAULT_SETTINGS.gtm_id,
      meta_pixel_id: (map.general as SiteSettings | undefined)?.meta_pixel_id || DEFAULT_SETTINGS.meta_pixel_id,
      instagram_pixel_id:
        (map.general as SiteSettings | undefined)?.instagram_pixel_id || DEFAULT_SETTINGS.instagram_pixel_id,
      tiktok_pixel_id:
        (map.general as SiteSettings | undefined)?.tiktok_pixel_id || DEFAULT_SETTINGS.tiktok_pixel_id,
      homepage: mergeHomepage(
        (map.homepage as SiteSettings["homepage"]) ||
          (typeof map.general === "object" && map.general
            ? (map.general as SiteSettings).homepage
            : undefined)
      ),
    } as SiteSettings;
  } catch {
    return { ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) };
  }
}

export async function getLeads(): Promise<Lead[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    return data as Lead[] | null;
  });
}

export async function getBookings(): Promise<Booking[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    return data as Booking[] | null;
  });
}

export async function getChatLeads(): Promise<ChatLead[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("chat_leads").select("*").order("created_at", { ascending: false });
    return data as ChatLead[] | null;
  });
}

export async function getCmsPages(): Promise<CmsPage[]> {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("cms_pages").select("*").order("slug");
    return data as CmsPage[] | null;
  });
}

export async function getAdminUsers() {
  return queryRows(async (supabase) => {
    const { data } = await supabase.from("admin_users").select("id, email, role").order("email");
    return data as { id: string; email: string; role: string }[] | null;
  });
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
