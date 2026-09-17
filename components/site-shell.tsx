import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import type { SiteSettings } from "@/lib/types";

export function SiteShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
      <WhatsAppFloatingButton phone={settings.whatsapp} />
      <CookieConsentBanner />
    </>
  );
}
