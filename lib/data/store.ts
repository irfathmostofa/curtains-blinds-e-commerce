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
import { DEFAULT_SETTINGS } from "@/lib/site";
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

export function getStore(): Store {
  if (!g.__mdStore) g.__mdStore = seed();
  return g.__mdStore;
}

export function resetStore() {
  g.__mdStore = seed();
}
