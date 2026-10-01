import { cache } from "react";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { createPublicClient } from "@/lib/supabase/server";
import { createWriteClient } from "@/lib/supabase/admin";
import { getStore } from "@/lib/data/store";
import { DEFAULT_SETTINGS, mergeHomepage, normalizePaymentMethods, omitSecrets, SECRET_SETTING_KEYS } from "@/lib/site";
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

const CATALOG_REVALIDATE = 60;

function hydrate(product: Product, categories: Category[], variants: ProductVariant[]): Product {
  return {
    ...product,
    category: categories.find((c) => c.id === product.category_id),
    variants: variants.filter((v) => v.product_id === product.id),
  };
}

function catalogClient() {
  return createPublicClient();
}

async function queryRows<T>(fn: (client: NonNullable<ReturnType<typeof catalogClient>>) => Promise<T[] | null>): Promise<T[]> {
  const supabase = catalogClient();
  if (!supabase) return [];
  try {
    const data = await fn(supabase);
    return data ?? [];
  } catch {
    return [];
  }
}

async function queryAdminRows<T>(
  fallback: T[],
  fn: (client: NonNullable<ReturnType<typeof createWriteClient>>) => Promise<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const supabase = createWriteClient();
  if (!supabase) return fallback;
  try {
    const { data, error } = await fn(supabase);
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

function cached<T>(key: string, fn: () => Promise<T>) {
  return unstable_cache(fn, [key], { revalidate: CATALOG_REVALIDATE, tags: ["catalog"] });
}

const fetchCategories = cached("catalog-categories", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return data as Category[] | null;
  })
);

const fetchVariants = cached("catalog-variants", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("product_variants").select("*");
    return data as ProductVariant[] | null;
  })
);

const fetchActiveProducts = cached("catalog-products-active", async () => {
  const supabase = catalogClient();
  if (!supabase) return [] as Product[];
  const [catRes, varRes, prodRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("product_variants").select("*"),
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }),
  ]);
  const categories = (catRes.data as Category[]) ?? [];
  const variants = (varRes.data as ProductVariant[]) ?? [];
  const products = (prodRes.data as Product[]) ?? [];
  return products.map((p) => hydrate(p, categories, variants));
});

const fetchFaqs = cached("catalog-faqs", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    return data as Faq[] | null;
  })
);

const fetchPartners = cached("catalog-partners", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("partners").select("*").order("sort_order");
    return data as Partner[] | null;
  })
);

const fetchFeaturedTestimonials = cached("catalog-testimonials-featured", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("testimonials").select("*").eq("is_featured", true).order("created_at", { ascending: false });
    return data as Testimonial[] | null;
  })
);

const fetchPublishedPosts = cached("catalog-blog-published", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("blog_posts").select("*").not("published_at", "is", null).order("published_at", { ascending: false });
    return data as BlogPost[] | null;
  })
);

const fetchCmsPages = cached("catalog-cms-pages", async () =>
  queryRows(async (supabase) => {
    const { data } = await supabase.from("cms_pages").select("*").order("slug");
    return data as CmsPage[] | null;
  })
);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function str(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return value === true || value === "true" || value === "on" || value === 1 || value === "1";
}

function assembleSettings(
  map: Record<string, unknown>,
  includeSecrets: boolean
): SiteSettings {
  const general = asRecord(map.general);
  const secrets = asRecord(map.secrets);
  const assembled: SiteSettings = {
    ...DEFAULT_SETTINGS,
    company_name: str(general.company_name, DEFAULT_SETTINGS.company_name),
    site_url: str(general.site_url, DEFAULT_SETTINGS.site_url),
    tagline: str(general.tagline, DEFAULT_SETTINGS.tagline),
    phone: str(general.phone, DEFAULT_SETTINGS.phone),
    email: str(general.email, DEFAULT_SETTINGS.email),
    whatsapp: str(general.whatsapp, DEFAULT_SETTINGS.whatsapp),
    business_hours: str(general.business_hours, DEFAULT_SETTINGS.business_hours),
    nav_links: (map.nav_links as SiteSettings["nav_links"]) || DEFAULT_SETTINGS.nav_links,
    locations: (map.locations as SiteSettings["locations"]) || DEFAULT_SETTINGS.locations,
    social_links: (map.social_links as SiteSettings["social_links"]) || DEFAULT_SETTINGS.social_links,
    payment_methods: normalizePaymentMethods(general.payment_methods),
    trust: (map.trust as SiteSettings["trust"]) || DEFAULT_SETTINGS.trust,
    seo: { ...DEFAULT_SETTINGS.seo, ...((map.seo as SiteSettings["seo"]) || {}) },
    gtm_id: str(general.gtm_id),
    meta_pixel_id: str(general.meta_pixel_id),
    instagram_pixel_id: str(general.instagram_pixel_id),
    tiktok_pixel_id: str(general.tiktok_pixel_id),
    resend_api_key: "",
    resend_from_email: "",
    meta_capi_access_token: "",
    instagram_capi_access_token: "",
    tiktok_access_token: "",
    meta_capi_test_event_code: "",
    tiktok_test_event_code: "",
    under_construction: asBool(general.under_construction, false),
    homepage: mergeHomepage(
      (map.homepage as SiteSettings["homepage"]) || (general.homepage as SiteSettings["homepage"] | undefined)
    ),
  };
  if (includeSecrets) {
    for (const key of SECRET_SETTING_KEYS) {
      assembled[key] = str(secrets[key]);
    }
  }
  return assembled;
}

const fetchSiteSettings = cached("catalog-site-settings", async (): Promise<SiteSettings> => {
  const supabase = catalogClient();
  if (!supabase) return omitSecrets({ ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) });
  try {
    const { data } = await supabase.from("site_settings").select("key, value").neq("key", "secrets");
    if (!data?.length) return omitSecrets({ ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) });
    const map = Object.fromEntries(data.map((row: { key: string; value: unknown }) => [row.key, row.value]));
    return omitSecrets(assembleSettings(map, false));
  } catch {
    return omitSecrets({ ...DEFAULT_SETTINGS, homepage: mergeHomepage(DEFAULT_SETTINGS.homepage) });
  }
});

export async function getAdminSiteSettings(): Promise<SiteSettings> {
  const supabase = createWriteClient();
  if (!supabase) {
    const store = getStore();
    return { ...store.settings, homepage: mergeHomepage(store.settings.homepage) };
  }
  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    if (!data?.length) {
      const store = getStore();
      return { ...store.settings, homepage: mergeHomepage(store.settings.homepage) };
    }
    const map = Object.fromEntries(data.map((row: { key: string; value: unknown }) => [row.key, row.value]));
    return assembleSettings(map, true);
  } catch {
    const store = getStore();
    return { ...store.settings, homepage: mergeHomepage(store.settings.homepage) };
  }
}

export const getCategories = cache(fetchCategories);
export const getVariants = cache(fetchVariants);

export const getProducts = cache(async (opts?: { includeInactive?: boolean }): Promise<Product[]> => {
  if (!opts?.includeInactive) return fetchActiveProducts();
  const [categories, variants, products] = await Promise.all([
    queryRows(async (supabase) => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data as Category[] | null;
    }),
    queryRows(async (supabase) => {
      const { data } = await supabase.from("product_variants").select("*");
      return data as ProductVariant[] | null;
    }),
    queryRows(async (supabase) => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return data as Product[] | null;
    }),
  ]);
  return products.map((p) => hydrate(p, categories, variants));
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | undefined> => {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
});

export const getProductsByCategory = cache(async (categoryId: string): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.category_id === categoryId);
});

export const getBestsellers = cache(async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.is_bestseller);
});

export const getRelatedProducts = cache(async (productId: string, categoryId: string, limit = 3): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.category_id === categoryId && p.id !== productId).slice(0, limit);
});

export async function getTestimonials(opts?: { includeHidden?: boolean }): Promise<Testimonial[]> {
  if (opts?.includeHidden) {
    return queryRows(async (supabase) => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      return data as Testimonial[] | null;
    });
  }
  return fetchFeaturedTestimonials();
}

export const getPartners = cache(fetchPartners);

export const getFaqs = cache(async (category?: string): Promise<Faq[]> => {
  const all = await fetchFaqs();
  return category ? all.filter((f) => f.category === category) : all;
});

export async function getBlogPosts(opts?: { includeDrafts?: boolean }): Promise<BlogPost[]> {
  if (opts?.includeDrafts) {
    return queryRows(async (supabase) => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      return data as BlogPost[] | null;
    });
  }
  const posts = await fetchPublishedPosts();
  return posts.filter((p) => p.published_at);
}

export const getBlogPost = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
});

export const getCmsPages = cache(fetchCmsPages);

export const getCmsPage = cache(async (slug: string): Promise<CmsPage | undefined> => {
  const pages = await getCmsPages();
  return pages.find((p) => p.slug === slug);
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!catalogClient()) {
    const store = getStore();
    return omitSecrets({ ...store.settings, homepage: mergeHomepage(store.settings.homepage) });
  }
  return fetchSiteSettings();
});

export async function getLeads(): Promise<Lead[]> {
  return queryAdminRows(getStore().leads, async (supabase) => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    return { data: data as Lead[] | null, error };
  });
}

export async function getBookings(): Promise<Booking[]> {
  return queryAdminRows(getStore().bookings, async (supabase) => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    return { data: data as Booking[] | null, error };
  });
}

export async function getChatLeads(): Promise<ChatLead[]> {
  return queryAdminRows(getStore().chatLeads, async (supabase) => {
    const { data, error } = await supabase.from("chat_leads").select("*").order("created_at", { ascending: false });
    return { data: data as ChatLead[] | null, error };
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
