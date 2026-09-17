import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTABanner } from "@/components/cta-banner";
import { PartnerLogosStrip } from "@/components/partner-logos-strip";
import { SectionHeading } from "@/components/section-heading";
import { getPartners } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trade & Partnerships Programme",
  description:
    "Project pricing, sample libraries and dedicated support for interior designers, developers and hoteliers in the UAE.",
  path: "/partnerships",
});

export default async function PartnershipsPage() {
  const partners = await getPartners();
  return (
    <main className="container space-y-10 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Partnerships", path: "/partnerships" }]} />
      <SectionHeading
        as="h1"
        title="Trade programme"
        subtitle="Interior designers, developers and FF&E teams get project pricing, reserve stock and a named account lead."
      />
      <ul className="grid gap-6 md:grid-cols-3">
        {[
          { t: "Project pricing", d: "Tiered discounts from residential refreshes to multi-key hotel floors." },
          { t: "Sample library", d: "Memo sets for blackout, sunscreen, linen and hardware finish boards." },
          { t: "Site support", d: "We attend snagging with your contractor and document motor scenes." },
        ].map((item) => (
          <li key={item.t} className="rounded-2xl border bg-card p-6">
            <h2 className="font-serif text-2xl">{item.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
          </li>
        ))}
      </ul>
      <PartnerLogosStrip logos={partners} />
      <CTABanner
        title="Request a trade account"
        subtitle="Tell us about your studio. We reply within one working day."
        buttonLabel="Get in touch"
        buttonHref="/get-estimate"
      />
    </main>
  );
}
