import type {
  HeroSlide,
  HomepageContent,
  HomepageSectionId,
  HomepageSectionLayout,
  SiteSettings,
} from "@/lib/types";

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
  social_links: [
    { label: "Instagram", href: "https://instagram.com/maisondrape" },
    { label: "Facebook", href: "https://facebook.com/maisondrape" },
    { label: "TikTok", href: "https://tiktok.com/@maisondrape" },
    { label: "Pinterest", href: "https://pinterest.com/maisondrape" },
    { label: "LinkedIn", href: "https://linkedin.com/company/maisondrape" },
  ],
  payment_methods: ["Visa", "Mastercard", "Apple Pay", "Cash on Delivery", "Bank Transfer"],
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
    features: [
      { icon: "ruler", title: "Free measuring visit", body: "Consultants bring fabric books to your villa or apartment." },
      { icon: "shield", title: "12-month warranty", body: "Workmanship cover on every install, plus motor manufacturer warranty." },
      { icon: "sparkles", title: "UAE-ready fabrics", body: "UV-stable weaves, blackout and sunscreen specified for Gulf glare." },
      { icon: "clock", title: "Same-week visit", body: "Dubai and Abu Dhabi diaries typically open within 48 hours." },
    ],
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
      { id: "features", enabled: false },
      { id: "collections", enabled: true },
      { id: "filtered_products", enabled: true },
      { id: "bestsellers", enabled: true },
      { id: "reviews", enabled: true },
      { id: "cta", enabled: true },
      { id: "partners", enabled: true },
      { id: "faqs", enabled: true },
      { id: "story", enabled: true },
    ],
  },
};

export const HOMEPAGE_SECTION_LABELS: Record<HomepageSectionId, string> = {
  hero: "Hero",
  marquee: "Marquee",
  intro: "Introduction",
  how_it_works: "How it works",
  features: "Feature cards",
  collections: "Collections",
  filtered_products: "Filter products",
  bestsellers: "Bestsellers",
  reviews: "Reviews",
  cta: "Estimate CTA",
  partners: "Partners",
  faqs: "FAQs",
  story: "Story / SEO copy",
};

export const DEFAULT_SECTION_ORDER: HomepageSectionLayout[] = DEFAULT_SETTINGS.homepage.section_order;

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
    features: saved.features?.length ? saved.features : base.features.map((f) => ({ ...f })),
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
