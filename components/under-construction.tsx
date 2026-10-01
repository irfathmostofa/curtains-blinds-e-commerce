import type { SiteSettings } from "@/lib/types";

export function UnderConstruction({ settings }: { settings: SiteSettings }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 py-16 text-center">
      <p className="font-serif text-3xl sm:text-4xl">{settings.company_name}</p>
      <h1 className="mt-8 font-serif text-4xl sm:text-5xl">Under construction</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The site is being prepared. Please check back soon.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
        {settings.email && settings.phone ? " · " : null}
        {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a> : null}
      </p>
    </main>
  );
}
