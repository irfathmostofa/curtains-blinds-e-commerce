import {
  blogPosts,
  bookings,
  categories,
  cmsPages,
  faqs,
  leads,
  partners,
  productVariants,
  products,
  testimonials,
} from "@/lib/data/fallback";
import { DEFAULT_SETTINGS, mergeHomepage } from "@/lib/site";
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

type Store = {
  categories: Category[];
  products: Product[];
  variants: ProductVariant[];
  leads: Lead[];
  bookings: Booking[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  faqs: Faq[];
  partners: Partner[];
  pages: CmsPage[];
  settings: SiteSettings;
  users: { id: string; email: string; role: string }[];
};

const g = globalThis as unknown as { __mdStore?: Store };

function seed(): Store {
  return {
    categories: structuredClone(categories),
    products: structuredClone(products),
    variants: structuredClone(productVariants),
    leads: structuredClone(leads),
    bookings: structuredClone(bookings),
    testimonials: structuredClone(testimonials),
    posts: structuredClone(blogPosts),
    faqs: structuredClone(faqs),
    partners: structuredClone(partners),
    pages: structuredClone(cmsPages),
    settings: structuredClone(DEFAULT_SETTINGS),
    users: [{ id: "u1", email: "admin@maisondrape.ae", role: "admin" }],
  };
}

const BROKEN_HERO = "photo-1615800002234-05ed6eaff144";
const VALID_HERO = "photo-1618221195710-dd6b41faaea6";

function repairBrokenHero(url?: string) {
  return url?.includes(BROKEN_HERO) ? url.replace(BROKEN_HERO, VALID_HERO) : url;
}

export function getStore(): Store {
  if (!g.__mdStore) g.__mdStore = seed();
  g.__mdStore.settings.homepage = mergeHomepage(g.__mdStore.settings.homepage);
  g.__mdStore.settings.seo = { ...DEFAULT_SETTINGS.seo, ...g.__mdStore.settings.seo };
  g.__mdStore.settings.homepage.hero.image_url =
    repairBrokenHero(g.__mdStore.settings.homepage.hero.image_url) ||
    DEFAULT_SETTINGS.homepage.hero.image_url;
  g.__mdStore.settings.seo.og_image =
    repairBrokenHero(g.__mdStore.settings.seo.og_image) || DEFAULT_SETTINGS.seo.og_image;
  return g.__mdStore;
}

export function resetStore() {
  g.__mdStore = seed();
}
