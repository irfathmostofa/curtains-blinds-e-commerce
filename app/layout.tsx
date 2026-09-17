import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Curtains & Blinds in Dubai & Abu Dhabi`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Bespoke curtains, blinds and motorised window treatments with free in-home measuring across Dubai and Abu Dhabi.",
};

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
