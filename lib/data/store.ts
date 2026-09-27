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

type Store = {
  categories: Category[];
  products: Product[];
  variants: ProductVariant[];
  leads: Lead[];
  chatLeads: ChatLead[];
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
    chatLeads: [
      {
        id: "cl1",
        name: "Lina Haddad",
        phone: "+971 50 888 4411",
        email: "lina@example.com",
        product_interest: "curtains-and-drapes",
        rooms: "3–4 rooms",
        location: "Palm Jumeirah",
        estimate_min: 3346,
        estimate_max: 5222,
        booking_date: "2026-09-28",
        booking_time: "10:00–12:00",
        transcript: [
          { role: "bot", text: "Hello — I can suggest an estimate and book a free visit. What is your name?" },
          { role: "user", text: "Lina Haddad" },
          { role: "bot", text: "Suggested estimate for Palm Jumeirah: AED 3,346–5,222." },
          { role: "user", text: "2026-09-28 10:00–12:00" },
        ],
        source: "ai-chatbot",
        status: "new",
        created_at: "2026-09-18T11:00:00.000Z",
      },
    ],
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
  if (!Array.isArray(g.__mdStore.chatLeads)) g.__mdStore.chatLeads = [];
  g.__mdStore.settings.homepage = mergeHomepage(g.__mdStore.settings.homepage);
  g.__mdStore.settings.seo = { ...DEFAULT_SETTINGS.seo, ...g.__mdStore.settings.seo };
  g.__mdStore.settings.seo.google_site_verification =
    g.__mdStore.settings.seo.google_site_verification || DEFAULT_SETTINGS.seo.google_site_verification;
  g.__mdStore.settings.seo.bing_site_verification =
    g.__mdStore.settings.seo.bing_site_verification || DEFAULT_SETTINGS.seo.bing_site_verification;
  g.__mdStore.settings.gtm_id = g.__mdStore.settings.gtm_id || DEFAULT_SETTINGS.gtm_id;
  g.__mdStore.settings.meta_pixel_id = g.__mdStore.settings.meta_pixel_id || DEFAULT_SETTINGS.meta_pixel_id;
  g.__mdStore.settings.instagram_pixel_id =
    g.__mdStore.settings.instagram_pixel_id || DEFAULT_SETTINGS.instagram_pixel_id;
  g.__mdStore.settings.tiktok_pixel_id = g.__mdStore.settings.tiktok_pixel_id || DEFAULT_SETTINGS.tiktok_pixel_id;
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
