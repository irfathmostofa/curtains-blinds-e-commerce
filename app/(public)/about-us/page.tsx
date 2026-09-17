import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { CTABanner } from "@/components/cta-banner";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/data/catalog";

export const metadata = buildMetadata({
  title: "About Maison Drape",
  description:
    "Atelier making custom curtains, blinds and motorised tracks for Dubai and Abu Dhabi homes, hotels and designers.",
  path: "/about-us",
});

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <main className="container space-y-10 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About us", path: "/about-us" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Studio"
        title="An atelier for Gulf light"
        subtitle="Maison Drape started as a curtain workroom and grew into a full window-treatment studio: drapes, blinds, motors and trade supply."
      />
      <div className="prose prose-stone max-w-3xl">
        <p>
          We measure in villas from Palm Jumeirah to Saadiyat, and in apartments where a 3cm reveal decides whether a cassette will sit cleanly. That is the work: not selling a catalogue SKU, but specifying fabric, lining and hardware against real glass, real HVAC and real stack-back.
        </p>
        <p>
          Installers are in-house. Consultants carry blackout, sunscreen and linen in the same bag. Motors are documented for your systems integrator. The {settings.trust.warranty.toLowerCase()} is written on every job sheet.
        </p>
        <h2>Where we work</h2>
        <ul>
          {settings.locations.map((loc) => (
            <li key={loc.city}>
              <strong>{loc.city}:</strong> {loc.address}
            </li>
          ))}
        </ul>
      </div>
      <CTABanner
        title="Visit the workroom or we will come to you"
        subtitle="Book a complimentary measuring appointment."
        buttonLabel="Book a free visit"
        buttonHref="/book"
      />
    </main>
  );
}
