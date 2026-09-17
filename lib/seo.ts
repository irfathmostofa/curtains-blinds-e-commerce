import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { SeoConfig, SiteSettings } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

export function buildMetadata(config: SeoConfig): Metadata {
  const url = absoluteUrl(config.path);
  const title = config.title.includes(SITE_NAME) ? config.title : `${config.title} | ${SITE_NAME}`;
  const image =
    config.image ||
    "https://images.unsplash.com/photo-1615800002234-05ed6eaff144?auto=format&fit=crop&w=1200&q=80";

  return {
    title,
    description: config.description,
    alternates: { canonical: url },
    robots: config.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: config.description,
      url,
      siteName: SITE_NAME,
      type: config.type === "article" ? "article" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: config.description,
      images: [image],
    },
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    sameAs: settings.social_links.map((s) => s.href),
  };
}

export function localBusinessJsonLd(settings: SiteSettings) {
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
    url: SITE_URL,
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
      item: absoluteUrl(item.path),
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
      acceptedAnswer: { "@type": "Answer", text: item.answer },
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    url: absoluteUrl(input.path),
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
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
    url: absoluteUrl(input.path),
    author: { "@type": "Person", name: input.author },
    datePublished: input.date,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}
