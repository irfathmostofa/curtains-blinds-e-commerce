import type { ReactNode } from "react";
import { AiChatbot } from "@/components/ai-chatbot";
import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { SiteConfigProvider } from "@/components/site-config";
import type { SiteSettings } from "@/lib/types";

export function SiteShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteConfigProvider
      value={{
        currency: settings.currency,
        cities: settings.form_cities,
        considering: settings.form_considering,
        budgets: settings.form_budgets,
        rooms: settings.form_rooms,
      }}
    >
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
      <WhatsAppFloatingButton phone={settings.whatsapp} />
      <BackToTop />
      <AiChatbot currency={settings.currency} cities={settings.form_cities} considering={settings.form_considering} rooms={settings.form_rooms} />
      <CookieConsentBanner />
    </SiteConfigProvider>
  );
}
