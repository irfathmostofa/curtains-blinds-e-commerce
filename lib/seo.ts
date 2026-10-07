import type { Metadata } from "next";
import { DEFAULT_SETTINGS, WEEKDAY_LABELS, WEEKDAYS, resolveSiteName, resolveSiteUrl } from "@/lib/site";
import type { SeoConfig, SiteSettings } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";
import { stripHtml } from "./html";


function siteDefaults(): SiteSettings {
  return DEFAULT_SETTINGS;
}

export function parseKeywords(value?: string | string[] | null) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(",");
  return list.map((k) => k.trim()).filter(Boolean);
}

export function mergeKeywords(...groups: Array<string | string[] | undefined | null>) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of groups) {
    for (const keyword of parseKeywords(group)) {
      const key = keyword.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(keyword);
    }
  }
  return out;
}

export function buildMetadata(config: SeoConfig, settings?: SiteSettings): Metadata {
  const site = settings || siteDefaults();
  const seo = site.seo;
  const siteName = resolveSiteName(site);
  const url = absoluteUrl(config.path, resolveSiteUrl(site));
  const title = config.title.includes(siteName) ? config.title : `${config.title} | ${siteName}`;
  const image =
    config.image ||
    seo.og_image ||
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80";
  const keywords = mergeKeywords(config.keywords, seo.keywords);

  return {
    title,
    description: config.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: config.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: config.description,
      url,
      siteName,
      type: config.type === "article" ? "article" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: config.description,
      images: [image],
      site: seo.twitter_handle || undefined,
    },
    verification: {
      google: seo.google_site_verification || undefined,
      other: seo.bing_site_verification
        ? { "msvalidate.01": seo.bing_site_verification }
        : undefined,
    },
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name,
    url: resolveSiteUrl(settings),
    telephone: settings.phone,
    email: settings.email,
    sameAs: settings.social_links.map((s) => s.href),
  };
}

export function localBusinessJsonLd(settings: SiteSettings) {
  const schedule = settings.business_hours_schedule;
  const openingHoursSpecification = WEEKDAYS.filter((day) => !schedule.days[day].closed).map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: WEEKDAY_LABELS[day],
    opens: schedule.days[day].open,
    closes: schedule.days[day].close,
  }));
  return settings.locations.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${settings.company_name} ${loc.city}`,
    telephone: loc.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: loc.city,
      addressCountry: "AE",
    },
    areaServed: loc.city,
    priceRange: "$$",
    url: resolveSiteUrl(settings),
    openingHoursSpecification,
  }));
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, resolveSiteUrl()),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(item.answer) },
    })),
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  image: string;
  price: number;
  path: string;
  rating?: number;
  reviewCount?: number;
  currency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    url: absoluteUrl(input.path, resolveSiteUrl()),
    offers: {
      "@type": "Offer",
      priceCurrency: input.currency || "AED",
      price: input.price,
      availability: "https://schema.org/InStock",
    },
    ...(input.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating,
            reviewCount: input.reviewCount || 12,
          },
        }
      : {}),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  image: string;
  path: string;
  author: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image,
    url: absoluteUrl(input.path, resolveSiteUrl()),
    author: { "@type": "Person", name: input.author },
    datePublished: input.date,
    publisher: { "@type": "Organization", name: resolveSiteName() },
  };
}
