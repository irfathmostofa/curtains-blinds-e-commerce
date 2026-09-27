import type { HomepageContent, SiteSettings } from "@/lib/types";

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "Maison Drape";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: SITE_NAME,
  tagline: "Bespoke curtains, blinds and motorised window treatments across the UAE.",
  phone: process.env.NEXT_PUBLIC_PHONE || "+971 4 555 1200",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@maisondrape.ae",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971500000000",
  business_hours: "Saturday–Thursday, 9:00–20:00",
  social_links: [
    { label: "Instagram", href: "https://instagram.com/maisondrape" },
    { label: "Pinterest", href: "https://pinterest.com/maisondrape" },
    { label: "LinkedIn", href: "https://linkedin.com/company/maisondrape" },
  ],
  nav_links: [
    { label: "Products", href: "/products" },
    { label: "Get Estimate", href: "/get-estimate" },
    { label: "Book a Visit", href: "/book" },
    { label: "About", href: "/about-us" },
    { label: "FAQs", href: "/faqs" },
    { label: "Blog", href: "/blog" },
    { label: "Partnerships", href: "/partnerships" },
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
    google_site_verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing_site_verification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
  },
  gtm_id: process.env.NEXT_PUBLIC_GTM_ID || "",
  meta_pixel_id: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  instagram_pixel_id: process.env.NEXT_PUBLIC_INSTAGRAM_PIXEL_ID || "",
  tiktok_pixel_id: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
  homepage: {
    hero: {
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
  },
};

export function mergeHomepage(saved?: Partial<HomepageContent> | null): HomepageContent {
  const base = DEFAULT_SETTINGS.homepage;
  if (!saved) return structuredClone(base);
  return {
    hero: { ...base.hero, ...saved.hero },
    marquee: saved.marquee?.length ? saved.marquee : [...base.marquee],
    how_it_works: {
      ...base.how_it_works,
      ...saved.how_it_works,
      steps: saved.how_it_works?.steps?.length
        ? saved.how_it_works.steps
        : base.how_it_works.steps.map((s) => ({ ...s })),
    },
    features: saved.features?.length ? saved.features : base.features.map((f) => ({ ...f })),
    collections: { ...base.collections, ...saved.collections },
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
  };
}
