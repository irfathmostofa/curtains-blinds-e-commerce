import {
  DEFAULT_SETTINGS,
  mergeHomepage,
  normalizeBusinessHoursSchedule,
  normalizeLocations,
  normalizePaymentMethods,
} from "@/lib/site";
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

function empty(): Store {
  return {
    categories: [],
    products: [],
    variants: [],
    leads: [],
    chatLeads: [],
    bookings: [],
    testimonials: [],
    posts: [],
    faqs: [],
    partners: [],
    pages: [],
    settings: structuredClone(DEFAULT_SETTINGS),
    users: [],
  };
}

export function getStore(): Store {
  if (!g.__mdStore) g.__mdStore = empty();
  g.__mdStore.settings.homepage = mergeHomepage(g.__mdStore.settings.homepage);
  g.__mdStore.settings.payment_methods = normalizePaymentMethods(g.__mdStore.settings.payment_methods);
  g.__mdStore.settings.locations = normalizeLocations(g.__mdStore.settings.locations);
  g.__mdStore.settings.business_hours_schedule = normalizeBusinessHoursSchedule(
    g.__mdStore.settings.business_hours_schedule
  );
  return g.__mdStore;
}

export function resetStore() {
  g.__mdStore = empty();
}
