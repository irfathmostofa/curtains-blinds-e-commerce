import type { Metadata } from "next";
import { Cinzel, Josefin_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/data/catalog";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/components/locale-provider";
import { localeDir, type Locale } from "@/lib/i18n";

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
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (cookies().get("md_locale")?.value === "ar" ? "ar" : "en") as Locale;
  return (
    <html lang={locale} dir={localeDir(locale)} className={locale === "ar" ? "locale-ar" : undefined}>
      <body className={`${serif.variable} ${sans.variable} ${arabic.variable} font-sans`}>
        <AnalyticsScripts />
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
