import {
  DEFAULT_SETTINGS,
  mergeAbout,
  mergeHomepage,
  normalizeBusinessHoursSchedule,
  normalizeLocations,
  normalizePaymentMethods,
  normalizePhoneList,
  primaryPhone,
} from "@/lib/site";
import {
  blogPosts,
  categories,
  cmsPages,
  faqs,
  partners,
  productVariants,
  products,
  testimonials,
} from "@/lib/data/fallback";
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
    categories: structuredClone(categories),
    products: structuredClone(products),
    variants: structuredClone(productVariants),
    leads: [
      {
        id: "demo-lead-1",
        name: "Amira Hassan",
        phone: "+971 50 111 2233",
        email: "amira.hassan@example.com",
        product_interest: "Blackout curtains",
        budget_range: "AED 5,000–10,000",
        message: "Looking for living room drapes.",
        source: "estimate",
        status: "new",
        created_at: "2026-10-12T09:00:00.000Z",
      },
      {
        id: "demo-lead-2",
        name: "James Whitaker",
        phone: "+971 55 222 3344",
        email: "james.whitaker@example.com",
        product_interest: "Motorized blinds",
        budget_range: "AED 10,000+",
        message: "Need a quote for three bedrooms.",
        source: "estimate",
        status: "contacted",
        created_at: "2026-10-18T11:30:00.000Z",
      },
      {
        id: "demo-lead-3",
        name: "Amira H.",
        phone: "+971 50 111 2233",
        email: "amira.hassan@example.com",
        product_interest: "Sheers",
        budget_range: "AED 3,000–5,000",
        message: "Follow-up for sheers.",
        source: "chat",
        status: "converted",
        created_at: "2026-10-22T08:15:00.000Z",
      },
    ],
    chatLeads: [
      {
        id: "demo-chat-1",
        name: "Priya Menon",
        phone: "+971 52 444 5566",
        email: "priya.menon@example.com",
        product_interest: "Roman blinds",
        rooms: "2 bedrooms",
        location: "Dubai Marina",
        estimate_min: 4200,
        estimate_max: 6800,
        booking_date: "2026-11-04",
        booking_time: "10:00–12:00",
        transcript: [],
        source: "chatbot",
        status: "new",
        created_at: "2026-10-20T14:00:00.000Z",
      },
      {
        id: "demo-chat-2",
        name: "Omar Al Farsi",
        phone: "+971 50 777 8899",
        email: "omar.alfarsi@example.com",
        product_interest: "S-wave drapes",
        rooms: "Villa living + dining",
        location: "Palm Jumeirah",
        estimate_min: 12000,
        estimate_max: 18000,
        booking_date: "",
        booking_time: "",
        transcript: [],
        source: "chatbot",
        status: "contacted",
        created_at: "2026-10-24T16:45:00.000Z",
      },
    ],
    bookings: [
      {
        id: "demo-booking-1",
        name: "James Whitaker",
        phone: "+971 55 222 3344",
        email: "james.whitaker@example.com",
        location: "Downtown Dubai",
        address: "Boulevard Point, Apt 2104",
        preferred_date: "2026-11-06",
        preferred_time_slot: "Afternoon",
        notes: "Penthouse living room",
        status: "confirmed",
        created_at: "2026-10-19T10:00:00.000Z",
      },
      {
        id: "demo-booking-2",
        name: "Sofia Rossi",
        phone: "+971 56 333 7788",
        email: "sofia.rossi@example.com",
        location: "Abu Dhabi",
        address: "Saadiyat Beach Residences",
        preferred_date: "2026-11-08",
        preferred_time_slot: "Morning",
        notes: "",
        status: "new",
        created_at: "2026-10-26T09:20:00.000Z",
      },
    ],
    testimonials: structuredClone(testimonials),
    posts: structuredClone(blogPosts),
    faqs: structuredClone(faqs),
    partners: structuredClone(partners),
    pages: structuredClone(cmsPages),
    settings: structuredClone(DEFAULT_SETTINGS),
    users: [],
  };
}

export function getStore(): Store {
  if (!g.__mdStore) g.__mdStore = empty();
  g.__mdStore.settings.homepage = mergeHomepage(g.__mdStore.settings.homepage);
  g.__mdStore.settings.about = mergeAbout(g.__mdStore.settings.about);
  g.__mdStore.settings.payment_methods = normalizePaymentMethods(g.__mdStore.settings.payment_methods);
  g.__mdStore.settings.locations = normalizeLocations(g.__mdStore.settings.locations);
  g.__mdStore.settings.phones = normalizePhoneList(g.__mdStore.settings.phones, g.__mdStore.settings.phone);
  g.__mdStore.settings.phone = primaryPhone(g.__mdStore.settings.phones, g.__mdStore.settings.phone);
  g.__mdStore.settings.business_hours_schedule = normalizeBusinessHoursSchedule(
    g.__mdStore.settings.business_hours_schedule
  );
  return g.__mdStore;
}

export function resetStore() {
  g.__mdStore = empty();
}
