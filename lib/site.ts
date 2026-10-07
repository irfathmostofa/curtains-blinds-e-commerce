import type {
  AboutContent,
  AboutSectionId,
  AboutSectionLayout,
  AboutTeamMember,
  BudgetOption,
  BusinessHoursSchedule,
  DayHours,
  FormOption,
  HeroSlide,
  HomepageContent,
  HomepageSectionId,
  HomepageSectionLayout,
  LocationInfo,
  PaymentMethod,
  SiteSettings,
  Weekday,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

export const SITE_NAME = "Maison Drape";

export const SITE_URL = "http://localhost:3000";

export const SECRET_SETTING_KEYS = [
  "resend_api_key",
  "resend_from_email",
  "meta_capi_access_token",
  "instagram_capi_access_token",
  "tiktok_access_token",
  "meta_capi_test_event_code",
  "tiktok_test_event_code",
] as const;

export type SecretSettingKey = (typeof SECRET_SETTING_KEYS)[number];

export function resolveSiteUrl(settings?: Pick<SiteSettings, "site_url"> | null) {
  const raw = settings?.site_url?.trim() || SITE_URL;
  return raw.replace(/\/$/, "") || SITE_URL;
}

export function resolveSiteName(settings?: Pick<SiteSettings, "company_name"> | null) {
  return settings?.company_name?.trim() || SITE_NAME;
}

export function omitSecrets<T extends Partial<SiteSettings>>(settings: T): T {
  const next = { ...settings };
  for (const key of SECRET_SETTING_KEYS) {
    (next as SiteSettings)[key] = "";
  }
  return next;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: SITE_NAME,
  site_url: SITE_URL,
  tagline: "Bespoke curtains, blinds and motorised window treatments across the UAE.",
  phone: "+971 4 555 1200",
  email: "hello@maisondrape.ae",
  whatsapp: "971500000000",
  business_hours: "Saturday–Thursday, 9:00–20:00",
  business_hours_schedule: {
    timezone: "Asia/Dubai",
    days: {
      sun: { closed: false, open: "09:00", close: "20:00" },
      mon: { closed: false, open: "09:00", close: "20:00" },
      tue: { closed: false, open: "09:00", close: "20:00" },
      wed: { closed: false, open: "09:00", close: "20:00" },
      thu: { closed: false, open: "09:00", close: "20:00" },
      fri: { closed: true, open: "09:00", close: "20:00" },
      sat: { closed: false, open: "09:00", close: "20:00" },
    },
  },
  social_links: [
    { label: "Instagram", href: "https://instagram.com/maisondrape" },
    { label: "Facebook", href: "https://facebook.com/maisondrape" },
    { label: "TikTok", href: "https://tiktok.com/@maisondrape" },
    { label: "Pinterest", href: "https://pinterest.com/maisondrape" },
    { label: "LinkedIn", href: "https://linkedin.com/company/maisondrape" },
  ],
  payment_methods: [
    { label: "Visa" },
    { label: "Mastercard" },
    { label: "Apple Pay" },
    { label: "Cash on Delivery" },
    { label: "Bank Transfer" },
  ],
  nav_links: [
    { label: "Products", href: "/products" },
    { label: "Get Estimate", href: "/get-estimate" },
    { label: "Book a Visit", href: "/book" },
    { label: "About", href: "/about-us" },
    { label: "FAQs", href: "/faqs" },
    { label: "Blog", href: "/blog" },
  ],
  locations: [
    {
      city: "Dubai",
      address: "Al Quoz Industrial Area 1, Warehouse 14, Dubai, UAE",
      phone: "+971 4 555 1200",
      mapEmbedUrl:
        "https://maps.google.com/maps?q=Al%20Quoz%20Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed",
    },
    {
      city: "Abu Dhabi",
      address: "Mussafah Industrial, Street 10, Abu Dhabi, UAE",
      phone: "+971 2 555 1188",
      mapEmbedUrl:
        "https://maps.google.com/maps?q=Mussafah%20Abu%20Dhabi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    },
  ],
  trust: {
    rating: 4.9,
    reviews: 1280,
    warranty: "12-month workmanship warranty",
  },
  seo: {
    default_title: `${SITE_NAME} | Curtains & Blinds in Dubai & Abu Dhabi`,
    default_description:
      "Bespoke curtains, blinds and motorised window treatments with free in-home measuring across Dubai and Abu Dhabi.",
    og_image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    keywords:
      "curtains Dubai, custom curtains Dubai, blackout curtains Dubai, sheer curtains Dubai, blinds Abu Dhabi, roller blinds Dubai, motorised curtains UAE, motorized curtain tracks Dubai, window treatments Dubai, made to measure curtains UAE, Palm Jumeirah curtains, Dubai Marina blinds",
    twitter_handle: "@maisondrape",
    google_site_verification: "",
    bing_site_verification: "",
  },
  gtm_id: "",
  meta_pixel_id: "",
  instagram_pixel_id: "",
  tiktok_pixel_id: "",
  resend_api_key: "",
  resend_from_email: "",
  meta_capi_access_token: "",
  instagram_capi_access_token: "",
  tiktok_access_token: "",
  meta_capi_test_event_code: "",
  tiktok_test_event_code: "",
  under_construction: false,
  currency: "AED",
  form_cities: [
    { id: "dubai", label: "Dubai", hint: "Villas, apartments and hotels" },
    { id: "abu-dhabi", label: "Abu Dhabi", hint: "Mussafah, islands and city homes" },
  ],
  form_considering: [
    { id: "curtains-and-drapes", label: "Curtains & drapes" },
    { id: "blinds-and-shades", label: "Blinds & shades" },
    { id: "motorized", label: "Motorized" },
    { id: "mix", label: "A mix" },
  ],
  form_budgets: [
    { id: "under-5k", label: "Under AED 5,000", max: 5000 },
    { id: "aed-5k-15k", label: "AED 5,000–15,000", min: 5000, max: 15000 },
    { id: "aed-15k-plus", label: "AED 15,000+", min: 15000 },
  ],
  form_rooms: [
    { id: "1-2-rooms", label: "1–2 rooms" },
    { id: "3-4-rooms", label: "3–4 rooms" },
    { id: "whole-villa", label: "Whole villa / 5+" },
  ],
  homepage: {
    hero: {
      variant: "classic",
      autoplay_ms: 6500,
      badge: "Dubai · Abu Dhabi · Trade programme",
      title: "Curtains and blinds that actually belong in a Gulf home.",
      subtitle:
        "Made-to-measure drapes, sheers, rollers and silent motors. One complimentary visit, a written estimate, installation that respects your floors.",
      primary_cta_label: "Book a free visit",
      primary_cta_href: "/book",
      secondary_cta_label: "Browse collections",
      secondary_cta_href: "/products",
      image_url:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      image_alt: "Floor-to-ceiling linen drapes in a bright Dubai living room",
      express_label: "Express",
      express_detail: "1–3 day installation",
    },
    hero_slides: [
      {
        badge: "Dubai · Abu Dhabi · Trade programme",
        title: "Curtains and blinds that actually belong in a Gulf home.",
        subtitle:
          "Made-to-measure drapes, sheers, rollers and silent motors. One complimentary visit, a written estimate, installation that respects your floors.",
        primary_cta_label: "Book a free visit",
        primary_cta_href: "/book",
        secondary_cta_label: "Browse collections",
        secondary_cta_href: "/products",
        image_url:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
        image_alt: "Floor-to-ceiling linen drapes in a bright Dubai living room",
        express_label: "Express",
        express_detail: "1–3 day installation",
      },
      {
        badge: "Blackout specialists",
        title: "Sleep through Gulf glare without losing the view.",
        subtitle:
          "Layered blackout and sheer stacks specified for floor-to-ceiling glass. Quiet tracks, clean returns, no light leaks at the edges.",
        primary_cta_label: "See blackout drapes",
        primary_cta_href: "/products",
        secondary_cta_label: "Book a visit",
        secondary_cta_href: "/book",
        image_url:
          "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
        image_alt: "Layered blackout curtains in a contemporary bedroom",
        express_label: "Quiet motors",
        express_detail: "Silent tracks available",
      },
      {
        badge: "Smart window treatments",
        title: "Motorised tracks that disappear into the architecture.",
        subtitle:
          "App, switch or scene control for villas and hotels. We specify, install and commission so the fabric and the motor arrive as one system.",
        primary_cta_label: "Explore motors",
        primary_cta_href: "/products",
        secondary_cta_label: "Get an estimate",
        secondary_cta_href: "/get-estimate",
        image_url:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
        image_alt: "Motorised sheer curtains in a sunlit living room",
        express_label: "Trade ready",
        express_detail: "Designer programme",
      },
    ],
    marquee: [
      "Free Doorstep Visit",
      "Instant Estimate Calculator",
      "1–3 Day Express Installation",
      "Blackout & Sheer Curtains",
      "Smart Motorized Tracks",
      "Downtown Dubai",
      "Palm Jumeirah",
      "Dubai Marina",
      "Business Bay",
    ],
    intro: {
      eyebrow: "Maison Drape",
      title: "Curtains and blinds that actually belong in a Gulf home.",
      subtitle:
        "Made-to-measure drapes, sheers, rollers and silent motors. One complimentary visit, a written estimate, installation that respects your floors.",
      primary_cta_label: "Book a free visit",
      primary_cta_href: "/book",
      secondary_cta_label: "Browse collections",
      secondary_cta_href: "/products",
      image_url:
        "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=1400&q=80",
      image_alt: "Layered sheer and linen curtains in a sunlit living room",
    },
    how_it_works: {
      eyebrow: "How it works",
      title: "Elegant curtains, delivered in four effortless steps.",
      subtitle:
        "From the first click to perfectly hung curtains — every step is taken care of by the Reef Deco team. No showroom visit required.",
      steps: [
        {
          number: "01",
          title: "Book a free site visit",
          body: "Pick a time slot — our specialist comes to your home, office or hotel at zero cost.",
        },
        {
          number: "02",
          title: "Samples & exact measurement",
          body: "We bring fabric swatches to your doorstep and measure each window precisely.",
        },
        {
          number: "03",
          title: "Select your curtain type",
          body: "Choose between blackout, sheer, motorized or roller blinds — or let our experts advise.",
        },
        {
          number: "04",
          title: "Installation in 1–3 days",
          body: "Our team produces and installs your custom curtains within 1 to 3 working days.",
        },
      ],
    },
    stats: {
      eyebrow: "By the numbers",
      title: "Work that shows up in the diary",
      subtitle: "Measured, specified and installed across Dubai and Abu Dhabi homes.",
      items: [
        { value: "1200", suffix: "+", label: "Projects Completed" },
        { value: "12", suffix: "+", label: "Years Experience" },
        { value: "98", suffix: "%", label: "Client Satisfaction" },
        { value: "3500", suffix: "+", label: "Design Consultations" },
      ],
    },
    features: [
      { icon: "ruler", title: "Free measuring visit", body: "Consultants bring fabric books to your villa or apartment." },
      { icon: "shield", title: "12-month warranty", body: "Workmanship cover on every install, plus motor manufacturer warranty." },
      { icon: "sparkles", title: "UAE-ready fabrics", body: "UV-stable weaves, blackout and sunscreen specified for Gulf glare." },
      { icon: "clock", title: "Same-week visit", body: "Dubai and Abu Dhabi diaries typically open within 48 hours." },
    ],
    areas: {
      eyebrow: "Coverage",
      title: "Areas we serve",
      subtitle: "In-home measuring across Dubai, Abu Dhabi and neighbouring communities.",
      items: [
        "Downtown Dubai",
        "Palm Jumeirah",
        "Dubai Marina",
        "Business Bay",
        "Emirates Hills",
        "Arabian Ranches",
        "Jumeirah",
        "Dubai Hills",
        "Saadiyat Island",
        "Yas Island",
        "Al Reem Island",
        "Khalifa City",
      ],
    },
    collections: {
      eyebrow: "Collections",
      title: "Window treatments for every elevation",
      subtitle: "Curtains, blinds and motors specified for villas, apartments and commercial interiors.",
    },
    filtered_products: {
      eyebrow: "Shop by type",
      title: "Filter the collection",
      subtitle: "Switch category to see pieces without leaving the homepage.",
      limit: 8,
      show_all_tab: true,
      show_bestsellers_tab: true,
    },
    bestsellers: {
      eyebrow: "Bestsellers",
      title: "Pieces clients reorder",
      subtitle: "",
    },
    reviews: {
      eyebrow: "Reviews",
      title: "Homes we have dressed",
      subtitle: "",
    },
    cta: {
      title: "Need a number before we visit?",
      subtitle: "Share room count, product type and budget. We reply the same working day.",
      button_label: "Get an estimate",
      button_href: "/get-estimate",
    },
    partners: {
      eyebrow: "Partners",
      title: "Studios and developers we supply",
      subtitle: "",
    },
    faqs: {
      eyebrow: "FAQs",
      title: "Before you book",
      subtitle: "Visits, lead times, motors and trade pricing — answered in plain language.",
    },
    story: {
      title: "Custom curtains and blinds across the UAE",
      paragraphs: [
        "Maison Drape is a made-to-measure curtains and blinds atelier serving Dubai and Abu Dhabi. We specify pinch-pleat and S-wave drapes, zebra and sunscreen rollers, roman shades and silent motorised tracks for villas, apartments, hotels and offices. Every project starts with a free in-home measuring visit so blackout, UV and stack-back are designed around your actual glass — not a catalogue sketch.",
        "Looking for custom curtains in Dubai, heat-ready blinds in Abu Dhabi, or smart motorised window treatments? Book a visit or request an estimate. Interior designers can join our trade programme.",
      ],
    },
    section_order: [
      { id: "hero", enabled: true },
      { id: "marquee", enabled: true },
      { id: "intro", enabled: true },
      { id: "how_it_works", enabled: true },
      { id: "stats", enabled: true },
      { id: "features", enabled: false },
      { id: "collections", enabled: true },
      { id: "filtered_products", enabled: true },
      { id: "bestsellers", enabled: true },
      { id: "reviews", enabled: true },
      { id: "areas", enabled: true },
      { id: "cta", enabled: true },
      { id: "partners", enabled: true },
      { id: "faqs", enabled: true },
      { id: "story", enabled: true },
    ],
  },
  about: {
    seo_title: "About Maison Drape",
    seo_description:
      "Atelier making custom curtains, blinds and motorised tracks for Dubai and Abu Dhabi homes, hotels and designers.",
    intro: {
      eyebrow: "About",
      title: "An atelier for Gulf light",
      subtitle:
        "<p>Maison Drape started as a curtain workroom and grew into a full window-treatment studio: drapes, blinds, motors and trade supply.</p><p>We measure in villas from Palm Jumeirah to Saadiyat, and in apartments where a 3cm reveal decides whether a cassette will sit cleanly. That is the work: not selling a catalogue SKU, but specifying fabric, lining and hardware against real glass, real HVAC and real stack-back.</p>",
      primary_cta_label: "Book a free visit",
      primary_cta_href: "/book",
      secondary_cta_label: "Browse collections",
      secondary_cta_href: "/products",
      image_url:
        "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=1400&q=80",
      image_alt: "Layered sheer and linen curtains in a sunlit living room",
    },
    mission_vision: {
      eyebrow: "Purpose",
      title: "Mission and vision",
      subtitle: "Specified for Gulf glare, villa stack-back and hotel programmes — not a catalogue SKU.",
      mission_title: "Mission",
      mission_body:
        "<p>Specify fabric, lining and hardware against real glass, real HVAC and real stack-back. Consultants carry blackout, sunscreen and linen in the same bag. Installers are in-house. Motors are documented for your systems integrator.</p>",
      vision_title: "Vision",
      vision_body:
        "<p>Window treatments that belong in a Gulf home: UV-stable weaves, silent tracks, and a 12-month workmanship warranty written on every job sheet — from Palm Jumeirah villas to Saadiyat apartments.</p>",
    },
    team: {
      eyebrow: "Studio",
      title: "The workroom",
      subtitle: "Consultants, installers and a trade desk — one atelier across Dubai and Abu Dhabi.",
      members: [
        {
          name: "Layla Al Mansoori",
          role: "Principal consultant",
          bio: "Specifies pinch-pleat, S-wave and motorised tracks for villas and hotel suites.",
          image_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
          image_alt: "Portrait of Layla Al Mansoori",
        },
        {
          name: "Omar Haddad",
          role: "Lead installer",
          bio: "In-house installs across Dubai and Abu Dhabi; cassette reveals and silent motors.",
          image_url:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
          image_alt: "Portrait of Omar Haddad",
        },
        {
          name: "Sofia Rahman",
          role: "Trade programme",
          bio: "Interior designers and developers: samples, lead times and documented motors.",
          image_url:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
          image_alt: "Portrait of Sofia Rahman",
        },
      ],
    },
    cta: {
      title: "Visit the workroom or we will come to you",
      subtitle: "Book a complimentary measuring appointment.",
      button_label: "Book a free visit",
      button_href: "/book",
    },
    section_order: [
      { id: "intro", enabled: true },
      { id: "mission_vision", enabled: true },
      { id: "team", enabled: true },
      { id: "cta", enabled: true },
    ],
  },
};

export const HOMEPAGE_SECTION_LABELS: Record<HomepageSectionId, string> = {
  hero: "Hero",
  marquee: "Marquee",
  intro: "Introduction",
  how_it_works: "How it works",
  stats: "Counters",
  features: "Feature cards",
  collections: "Collections",
  filtered_products: "Filter products",
  bestsellers: "Bestsellers",
  reviews: "Reviews",
  areas: "Areas we serve",
  cta: "Estimate CTA",
  partners: "Partners",
  faqs: "FAQs",
  story: "Story / SEO copy",
};

export const DEFAULT_SECTION_ORDER: HomepageSectionLayout[] = DEFAULT_SETTINGS.homepage.section_order;

export const ABOUT_SECTION_LABELS: Record<AboutSectionId, string> = {
  intro: "Image and content",
  mission_vision: "Mission and vision",
  team: "Team",
  cta: "Estimate CTA",
};

export const DEFAULT_ABOUT_SECTION_ORDER: AboutSectionLayout[] = DEFAULT_SETTINGS.about.section_order;

function slideFromHero(hero: HomepageContent["hero"]): HeroSlide {
  return {
    badge: hero.badge,
    title: hero.title,
    subtitle: hero.subtitle,
    primary_cta_label: hero.primary_cta_label,
    primary_cta_href: hero.primary_cta_href,
    secondary_cta_label: hero.secondary_cta_label,
    secondary_cta_href: hero.secondary_cta_href,
    image_url: hero.image_url,
    image_alt: hero.image_alt,
    express_label: hero.express_label,
    express_detail: hero.express_detail,
  };
}

function mergeSectionOrder(saved?: HomepageSectionLayout[] | null): HomepageSectionLayout[] {
  const defaults = baseSectionOrder();
  if (!saved?.length) return defaults;
  const known = new Set<HomepageSectionId>(defaults.map((s) => s.id));
  const fromSaved = saved.filter((s) => known.has(s.id)).map((s) => ({ id: s.id, enabled: s.enabled !== false }));
  const seen = new Set(fromSaved.map((s) => s.id));
  const missing = defaults.filter((s) => !seen.has(s.id));
  const merged = [...fromSaved];
  for (const section of missing) {
    const defaultIndex = defaults.findIndex((s) => s.id === section.id);
    const before = defaults.slice(0, defaultIndex).reverse().find((s) => seen.has(s.id));
    if (before) {
      const idx = merged.findIndex((s) => s.id === before.id);
      merged.splice(idx + 1, 0, { ...section });
    } else {
      merged.unshift({ ...section });
    }
    seen.add(section.id);
  }
  return merged;
}

function baseSectionOrder(): HomepageSectionLayout[] {
  return DEFAULT_SETTINGS.homepage.section_order.map((s) => ({ ...s }));
}

export const WEEKDAYS: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

function normalizeTime(value: unknown, fallback: string) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/);
  if (!match) return fallback;
  const hour = Number(match[1]);
  if (hour > 23) return fallback;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

export function normalizeLocations(value: unknown): LocationInfo[] {
  if (!Array.isArray(value)) return DEFAULT_SETTINGS.locations.map((loc) => ({ ...loc }));
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<LocationInfo>;
      const city = String(row.city || "").trim();
      const address = String(row.address || "").trim();
      const phone = String(row.phone || "").trim();
      const mapEmbedUrl = String(row.mapEmbedUrl || "").trim();
      if (!city && !address && !phone) return null;
      return { city, address, phone, mapEmbedUrl };
    })
    .filter(Boolean) as LocationInfo[];
}

const KNOWN_CURRENCIES = new Set([
  "AED",
  "USD",
  "EUR",
  "GBP",
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "INR",
  "PKR",
  "EGP",
]);

export function normalizeCurrency(value: unknown): string {
  const raw = String(value || "").trim().toUpperCase();
  if (KNOWN_CURRENCIES.has(raw)) return raw;
  if (/^[A-Z]{3}$/.test(raw)) return raw;
  return DEFAULT_SETTINGS.currency;
}

function asOptionId(value: unknown, label: string, fallback: string) {
  const raw = String(value || "").trim();
  if (raw) return slugify(raw) || fallback;
  return slugify(label) || fallback;
}

export function normalizeFormOptions(value: unknown, fallback: FormOption[]): FormOption[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  const next = value
    .map((item, index) => {
      if (typeof item === "string") {
        const label = item.trim();
        if (!label) return null;
        return { id: asOptionId("", label, `option-${index + 1}`), label, hint: "" };
      }
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<FormOption>;
      const label = String(row.label || "").trim();
      if (!label) return null;
      return {
        id: asOptionId(row.id, label, `option-${index + 1}`),
        label,
        hint: String(row.hint || "").trim(),
      };
    })
    .filter(Boolean) as FormOption[];
  return next.length ? next : fallback.map((item) => ({ ...item }));
}

export function normalizeBudgetOptions(value: unknown, fallback: BudgetOption[]): BudgetOption[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  const next = value
    .map((item, index) => {
      if (typeof item === "string") {
        const label = item.trim();
        if (!label) return null;
        return { id: asOptionId("", label, `budget-${index + 1}`), label, hint: "" };
      }
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<BudgetOption>;
      const label = String(row.label || "").trim();
      if (!label) return null;
      const min = Number(row.min);
      const max = Number(row.max);
      return {
        id: asOptionId(row.id, label, `budget-${index + 1}`),
        label,
        hint: String(row.hint || "").trim(),
        min: Number.isFinite(min) && min > 0 ? min : undefined,
        max: Number.isFinite(max) && max > 0 ? max : undefined,
      };
    })
    .filter(Boolean) as BudgetOption[];
  return next.length ? next : fallback.map((item) => ({ ...item }));
}

export function cityLabels(settings?: Pick<SiteSettings, "form_cities" | "locations"> | null) {
  const fromForm = (settings?.form_cities || []).map((item) => item.label).filter(Boolean);
  if (fromForm.length) return fromForm;
  const fromLocations = (settings?.locations || []).map((item) => item.city).filter(Boolean);
  return fromLocations.length ? fromLocations : DEFAULT_SETTINGS.form_cities.map((item) => item.label);
}

export function normalizeBusinessHoursSchedule(value: unknown): BusinessHoursSchedule {
  const fallback = DEFAULT_SETTINGS.business_hours_schedule;
  const raw = value && typeof value === "object" ? (value as Partial<BusinessHoursSchedule>) : {};
  const timezone = String(raw.timezone || "").trim() || fallback.timezone;
  const days = {} as Record<Weekday, DayHours>;
  for (const day of WEEKDAYS) {
    const src = raw.days?.[day];
    const base = fallback.days[day];
    days[day] = {
      closed: Boolean(src?.closed ?? base.closed),
      open: normalizeTime(src?.open, base.open),
      close: normalizeTime(src?.close, base.close),
    };
  }
  return { timezone, days };
}

function minutesFromMidnight(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function weekdayFromIndex(index: number): Weekday {
  return WEEKDAYS[index] || "sun";
}

export function formatClock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = ((h + 11) % 12) + 1;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatBusinessHoursSummary(schedule: BusinessHoursSchedule) {
  const groups: { start: Weekday; end: Weekday; text: string }[] = [];
  for (const day of WEEKDAYS) {
    const hours = schedule.days[day];
    const text = hours.closed ? "Closed" : `${formatClock(hours.open)}–${formatClock(hours.close)}`;
    const last = groups[groups.length - 1];
    if (last && last.text === text) {
      last.end = day;
      continue;
    }
    groups.push({ start: day, end: day, text });
  }
  return groups
    .map((group) => {
      const days =
        group.start === group.end
          ? WEEKDAY_LABELS[group.start]
          : `${WEEKDAY_LABELS[group.start]}–${WEEKDAY_LABELS[group.end]}`;
      return `${days}: ${group.text}`;
    })
    .join(" · ");
}

export function getLocalParts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const weekdayMap: Record<string, Weekday> = {
    Sun: "sun",
    Mon: "mon",
    Tue: "tue",
    Wed: "wed",
    Thu: "thu",
    Fri: "fri",
    Sat: "sat",
  };
  return {
    weekday: weekdayMap[parts.weekday] || weekdayFromIndex(date.getDay()),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function getAvailability(schedule: BusinessHoursSchedule, now = new Date()) {
  const { weekday, minutes } = getLocalParts(now, schedule.timezone);
  const today = schedule.days[weekday];
  const open = minutesFromMidnight(today.open);
  const close = minutesFromMidnight(today.close);
  const overnight = close <= open;
  const isOpen = !today.closed && (overnight ? minutes >= open || minutes < close : minutes >= open && minutes < close);
  return {
    isOpen,
    weekday,
    today,
    label: isOpen ? "Open now" : "Closed now",
    todayLabel: today.closed
      ? "Closed today"
      : `Today ${formatClock(today.open)}–${formatClock(today.close)}`,
  };
}

export function normalizePaymentMethods(value: unknown): PaymentMethod[] {
  if (!Array.isArray(value)) return DEFAULT_SETTINGS.payment_methods.map((m) => ({ ...m }));
  const next = value
    .map((item) => {
      if (typeof item === "string") {
        const label = item.trim();
        return label ? { label } : null;
      }
      if (item && typeof item === "object") {
        const row = item as { label?: string; image_url?: string };
        const label = String(row.label || "").trim();
        if (!label) return null;
        const image_url = String(row.image_url || "").trim();
        return image_url ? { label, image_url } : { label };
      }
      return null;
    })
    .filter(Boolean) as PaymentMethod[];
  return next;
}

export function mergeHomepage(saved?: Partial<HomepageContent> | null): HomepageContent {
  const base = DEFAULT_SETTINGS.homepage;
  if (!saved) return structuredClone(base);
  const hero = {
    ...base.hero,
    ...saved.hero,
    variant: saved.hero?.variant === "carousel" ? "carousel" : saved.hero?.variant === "classic" ? "classic" : base.hero.variant,
    autoplay_ms: Number(saved.hero?.autoplay_ms) > 0 ? Number(saved.hero?.autoplay_ms) : base.hero.autoplay_ms,
  };
  const slides = saved.hero_slides?.length
    ? saved.hero_slides.map((slide) => ({ ...base.hero_slides[0], ...slide }))
    : [slideFromHero(hero), ...base.hero_slides.slice(1).map((s) => ({ ...s }))];
  return {
    hero,
    hero_slides: slides,
    marquee: saved.marquee?.length ? saved.marquee : [...base.marquee],
    intro: { ...base.intro, ...saved.intro },
    how_it_works: {
      ...base.how_it_works,
      ...saved.how_it_works,
      steps: saved.how_it_works?.steps?.length
        ? saved.how_it_works.steps
        : base.how_it_works.steps.map((s) => ({ ...s })),
    },
    stats: {
      ...base.stats,
      ...saved.stats,
      items: saved.stats?.items?.length ? saved.stats.items : base.stats.items.map((s) => ({ ...s })),
    },
    features: saved.features?.length ? saved.features : base.features.map((f) => ({ ...f })),
    areas: {
      ...base.areas,
      ...saved.areas,
      items: saved.areas?.items?.length ? saved.areas.items : [...base.areas.items],
    },
    collections: { ...base.collections, ...saved.collections },
    filtered_products: {
      ...base.filtered_products,
      ...saved.filtered_products,
      limit: Number(saved.filtered_products?.limit) > 0 ? Number(saved.filtered_products?.limit) : base.filtered_products.limit,
      show_all_tab: saved.filtered_products?.show_all_tab ?? base.filtered_products.show_all_tab,
      show_bestsellers_tab: saved.filtered_products?.show_bestsellers_tab ?? base.filtered_products.show_bestsellers_tab,
    },
    bestsellers: { ...base.bestsellers, ...saved.bestsellers },
    reviews: { ...base.reviews, ...saved.reviews },
    cta: { ...base.cta, ...saved.cta },
    partners: { ...base.partners, ...saved.partners },
    faqs: { ...base.faqs, ...saved.faqs },
    story: {
      ...base.story,
      ...saved.story,
      paragraphs: saved.story?.paragraphs?.length ? saved.story.paragraphs : [...base.story.paragraphs],
    },
    section_order: mergeSectionOrder(saved.section_order),
  };
}

function mergeAboutSectionOrder(saved?: AboutSectionLayout[] | null): AboutSectionLayout[] {
  const defaults = DEFAULT_SETTINGS.about.section_order.map((s) => ({ ...s }));
  if (!saved?.length) return defaults;
  const known = new Set<AboutSectionId>(defaults.map((s) => s.id));
  const fromSaved = saved.filter((s) => known.has(s.id)).map((s) => ({ id: s.id, enabled: s.enabled !== false }));
  const seen = new Set(fromSaved.map((s) => s.id));
  const missing = defaults.filter((s) => !seen.has(s.id));
  const merged = [...fromSaved];
  for (const section of missing) {
    const defaultIndex = defaults.findIndex((s) => s.id === section.id);
    const before = defaults.slice(0, defaultIndex).reverse().find((s) => seen.has(s.id));
    if (before) {
      const idx = merged.findIndex((s) => s.id === before.id);
      merged.splice(idx + 1, 0, { ...section });
    } else {
      merged.unshift({ ...section });
    }
    seen.add(section.id);
  }
  return merged;
}

function mergeTeamMembers(saved?: AboutTeamMember[] | null): AboutTeamMember[] {
  const base = DEFAULT_SETTINGS.about.team.members;
  if (!saved?.length) return base.map((m) => ({ ...m }));
  return saved.map((member) => ({
    name: String(member.name || "").trim(),
    role: String(member.role || "").trim(),
    bio: String(member.bio || "").trim(),
    image_url: String(member.image_url || "").trim(),
    image_alt: String(member.image_alt || "").trim(),
  }));
}

export function mergeAbout(saved?: Partial<AboutContent> | null): AboutContent {
  const base = DEFAULT_SETTINGS.about;
  if (!saved) return structuredClone(base);
  return {
    seo_title: saved.seo_title?.trim() || base.seo_title,
    seo_description: saved.seo_description?.trim() || base.seo_description,
    intro: { ...base.intro, ...saved.intro },
    mission_vision: { ...base.mission_vision, ...saved.mission_vision },
    team: {
      ...base.team,
      ...saved.team,
      members: mergeTeamMembers(saved.team?.members),
    },
    cta: { ...base.cta, ...saved.cta },
    section_order: mergeAboutSectionOrder(saved.section_order),
  };
}
