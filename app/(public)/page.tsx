import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { CTABanner } from "@/components/cta-banner";
import { FAQAccordion } from "@/components/faq-accordion";
import { PartnerLogosStrip } from "@/components/partner-logos-strip";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import {
  getBestsellers,
  getCategories,
  getFaqs,
  getPartners,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data/catalog";
import { buildMetadata, faqJsonLd, localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ShieldCheck, Ruler, Sparkles, Clock } from "lucide-react";
import { HeroIntro, HeroItem } from "@/components/hero-intro";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Bespoke Curtains & Blinds in Dubai & Abu Dhabi",
  description:
    "Maison Drape designs and installs custom curtains, blinds and motorised tracks. Free in-home visit, 12-month warranty, Dubai and Abu Dhabi.",
  path: "/",
});

const features = [
  { icon: Ruler, title: "Free measuring visit", body: "Consultants bring fabric books to your villa or apartment." },
  { icon: ShieldCheck, title: "12-month warranty", body: "Workmanship cover on every install, plus motor manufacturer warranty." },
  { icon: Sparkles, title: "UAE-ready fabrics", body: "UV-stable weaves, blackout and sunscreen specified for Gulf glare." },
  { icon: Clock, title: "Same-week visit", body: "Dubai and Abu Dhabi diaries typically open within 48 hours." },
];

export default async function HomePage() {
  const [settings, categories, bestsellers, testimonials, partners, faqs] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getBestsellers(),
    getTestimonials(),
    getPartners(),
    getFaqs(),
  ]);

  return (
    <main>
      <JsonLd data={organizationJsonLd(settings)} />
      {localBusinessJsonLd(settings).map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <JsonLd data={faqJsonLd(faqs.slice(0, 4))} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <HeroIntro>
            <HeroItem>
              <Badge>Dubai · Abu Dhabi · Trade programme</Badge>
            </HeroItem>
            <HeroItem className="mt-6">
              <h1 className="font-serif text-4xl leading-[1.1] text-balance md:text-6xl">
                Curtains and blinds that actually belong in a Gulf home.
              </h1>
            </HeroItem>
            <HeroItem className="mt-6">
              <p className="max-w-xl text-lg text-muted-foreground">
                Made-to-measure drapes, sheers, rollers and silent motors. One complimentary visit, a written estimate, installation that respects your floors.
              </p>
            </HeroItem>
            <HeroItem className="mt-6">
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/book">Book a free visit</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">Browse collections</Link>
                </Button>
              </div>
            </HeroItem>
            <HeroItem className="mt-6">
              <p className="text-sm text-muted-foreground">
                Rated {settings.trust.rating}/5 from {settings.trust.reviews.toLocaleString()} reviews · {settings.trust.warranty}
              </p>
            </HeroItem>
          </HeroIntro>
          <HeroVisual
            src="https://images.unsplash.com/photo-1615800002234-05ed6eaff144?auto=format&fit=crop&w=1600&q=80"
            alt="Floor-to-ceiling linen drapes in a bright Dubai living room"
          />
        </div>
      </section>

      <section className="container py-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                <f.icon className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
                <h2 className="font-serif text-xl">{f.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Collections"
            title="Window treatments for every elevation"
            subtitle="Curtains, blinds and motors specified for villas, apartments and commercial interiors."
          />
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <StaggerItem key={c.id}>
              <CategoryCard category={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading eyebrow="Bestsellers" title="Pieces clients reorder" />
        </Reveal>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={0.07}>
          {bestsellers.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading eyebrow="Reviews" title="Homes we have dressed" />
        </Reveal>
        <Reveal delay={0.1}>
          <TestimonialCarousel items={testimonials} />
        </Reveal>
      </section>

      <section className="container py-10">
        <CTABanner
          title="Need a number before we visit?"
          subtitle="Share room count, product type and budget. We reply the same working day."
          buttonLabel="Get an estimate"
          buttonHref="/get-estimate"
        />
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading eyebrow="Partners" title="Studios and developers we supply" align="center" />
        </Reveal>
        <PartnerLogosStrip logos={partners} />
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="FAQs"
            title="Before you book"
            subtitle="Visits, lead times, motors and trade pricing — answered in plain language."
          />
        </Reveal>
        <Reveal delay={0.12}>
          <FAQAccordion items={faqs.slice(0, 5)} />
        </Reveal>
      </section>

      <section className="container max-w-3xl space-y-4 py-16">
        <Reveal>
          <h2 className="font-serif text-3xl">Custom curtains and blinds across the UAE</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="leading-relaxed text-muted-foreground">
            Maison Drape is a made-to-measure curtains and blinds atelier serving Dubai and Abu Dhabi. We specify pinch-pleat and S-wave drapes, zebra and sunscreen rollers, roman shades and silent motorised tracks for villas, apartments, hotels and offices. Every project starts with a free in-home measuring visit so blackout, UV and stack-back are designed around your actual glass — not a catalogue sketch.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="leading-relaxed text-muted-foreground">
            Looking for <Link className="underline" href="/products/curtains-and-drapes">custom curtains in Dubai</Link>,{" "}
            <Link className="underline" href="/products/blinds-and-shades">heat-ready blinds in Abu Dhabi</Link>, or{" "}
            <Link className="underline" href="/products/motorized">smart motorised window treatments</Link>? Book a visit or request an estimate. Interior designers can join our{" "}
            <Link className="underline" href="/partnerships">trade programme</Link>.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
