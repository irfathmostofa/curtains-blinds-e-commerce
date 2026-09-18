import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/data/catalog";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings.seo;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.default_title || `${SITE_NAME} | Curtains & Blinds in Dubai & Abu Dhabi`,
      template: `%s | ${settings.company_name || SITE_NAME}`,
    },
    description: seo.default_description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: seo.default_title,
      description: seo.default_description,
      url: SITE_URL,
      siteName: settings.company_name || SITE_NAME,
      images: seo.og_image ? [{ url: seo.og_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.default_title,
      description: seo.default_description,
      images: seo.og_image ? [seo.og_image] : undefined,
      site: seo.twitter_handle || undefined,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans`}>
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
