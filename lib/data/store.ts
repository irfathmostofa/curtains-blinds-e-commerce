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
  return g.__mdStore;
}

export function resetStore() {
  g.__mdStore = empty();
}
