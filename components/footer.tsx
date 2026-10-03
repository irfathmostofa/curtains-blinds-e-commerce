"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { SocialIcon } from "@/components/social-icon";
import { PaymentBadges } from "@/components/payment-methods";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { t } = useLocale();
  return (
    <footer className="mt-12 border-t border-border bg-primary text-primary-foreground sm:mt-20">
      <div className="container grid gap-10 py-12 sm:py-14 md:grid-cols-4">
        <div className="space-y-3 md:col-span-1">
          <p className="font-serif text-2xl">{settings.company_name}</p>
          <p className="text-sm text-primary-foreground/70">{t(settings.tagline)}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">{t("Explore")}</h2>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {settings.nav_links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary-foreground">
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">{t("Visit")}</h2>
          <div className="mt-4 space-y-4 text-sm text-primary-foreground/80">
            {settings.locations.map((loc) => (
              <address key={loc.city} className="not-italic">
                <p className="font-medium text-primary-foreground">{loc.city}</p>
                <p>{loc.address}</p>
                <p>
                  <a href={`tel:${loc.phone.replace(/\s/g, "")}`}>{loc.phone}</a>
                </p>
              </address>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">{t("Contact")}</h2>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}>{t("WhatsApp")}</a>
            </li>
            <li>{settings.business_hours}</li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-3">
            {settings.social_links.filter((s) => s.href.trim()).map((s) => (
              <li key={`${s.label}-${s.href}`}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
                >
                  <SocialIcon label={s.label} href={s.href} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {settings.payment_methods.length ? (
        <div className="border-t border-primary-foreground/10">
          <div className="container flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold uppercase tracking-wider">{t("We accept")}</p>
            <PaymentBadges methods={settings.payment_methods} />
          </div>
        </div>
      ) : null}
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.company_name}. {t("All rights reserved.")}
          </p>
          <p className="flex gap-4">
            <Link href="/privacy-policy">{t("Privacy Policy")}</Link>
            <Link href="/terms-of-use">{t("Terms of Use")}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
