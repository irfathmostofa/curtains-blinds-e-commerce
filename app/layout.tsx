import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Cinzel, Josefin_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/data/catalog";
import { LocaleProvider } from "@/components/locale-provider";
import { NavigationProgress } from "@/components/navigation-progress";
import { localeDir } from "@/lib/i18n";

const serif = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
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
    verification: {
      google: seo.google_site_verification || undefined,
      other: seo.bing_site_verification
        ? { "msvalidate.01": seo.bing_site_verification }
        : undefined,
    },
    alternates: {
      canonical: SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = "en";
  return (
    <html lang={locale} dir={localeDir(locale)}>
      <body className={`${serif.variable} ${sans.variable} ${arabic.variable} font-sans`}>
        <Script
          id="locale-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )md_locale=([^;]*)/);var l=m&&m[1]==="ar"?"ar":"en";document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";document.documentElement.classList.toggle("locale-ar",l==="ar");}catch(e){}})();`,
          }}
        />
        <Suspense fallback={null}>
          <AnalyticsScripts />
        </Suspense>
        <LocaleProvider initial={locale}>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
