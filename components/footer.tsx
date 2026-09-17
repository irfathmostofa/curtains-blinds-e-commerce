import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1 space-y-3">
          <p className="font-serif text-2xl">{settings.company_name}</p>
          <p className="text-sm text-primary-foreground/70">{settings.tagline}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {settings.nav_links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">Visit</h2>
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
          <h2 className="text-sm font-semibold uppercase tracking-wider">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}>WhatsApp</a>
            </li>
            <li>{settings.business_hours}</li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {settings.social_links.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="underline-offset-4 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Use</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
