import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTABanner } from "@/components/cta-banner";
import { getCmsPage, getSiteSettings } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

const FALLBACK = {
  title: "An atelier for Gulf light",
  seo_title: "About Maison Drape",
  seo_description:
    "Atelier making custom curtains, blinds and motorised tracks for Dubai and Abu Dhabi homes, hotels and designers.",
  content: `<p>Maison Drape started as a curtain workroom and grew into a full window-treatment studio: drapes, blinds, motors and trade supply.</p>
<p>We measure in villas from Palm Jumeirah to Saadiyat, and in apartments where a 3cm reveal decides whether a cassette will sit cleanly. That is the work: not selling a catalogue SKU, but specifying fabric, lining and hardware against real glass, real HVAC and real stack-back.</p>
<p>Installers are in-house. Consultants carry blackout, sunscreen and linen in the same bag. Motors are documented for your systems integrator. The 12-month workmanship warranty is written on every job sheet.</p>`,
};

export async function generateMetadata() {
  const page = await getCmsPage("about-us");
  return buildMetadata({
    title: page?.seo_title || page?.title || FALLBACK.seo_title,
    description: page?.seo_description || FALLBACK.seo_description,
    path: "/about-us",
  });
}

export default async function AboutPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getCmsPage("about-us")]);
  const title = page?.title || FALLBACK.title;
  const content = page?.content || FALLBACK.content;

  return (
    <main className="container space-y-6 pt-4 pb-10 md:pt-5">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path: "/about-us" }]} />
      <article className="prose prose-stone max-w-3xl">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {settings.locations.length ? (
          <>
            <h2>Where we work</h2>
            <ul>
              {settings.locations.map((loc) => (
                <li key={loc.city}>
                  <strong>{loc.city}:</strong> {loc.address}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </article>
      <CTABanner
        title="Visit the workroom or we will come to you"
        subtitle="Book a complimentary measuring appointment."
        buttonLabel="Book a free visit"
        buttonHref="/book"
      />
    </main>
  );
}
