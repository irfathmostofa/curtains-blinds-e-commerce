import type { SiteSettings } from "@/lib/types";

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
      "https://images.unsplash.com/photo-1615800002234-05ed6eaff144?auto=format&fit=crop&w=1200&q=80",
    keywords: "curtains Dubai, blinds Abu Dhabi, motorised curtains UAE, blackout drapes",
    twitter_handle: "@maisondrape",
  },
};
