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
import type { HomepageFeature } from "@/lib/types";

export const revalidate = 0;

export const metadata = buildMetadata({
  title: "Bespoke Curtains & Blinds in Dubai & Abu Dhabi",
  description:
    "Maison Drape designs and installs custom curtains, blinds and motorised tracks. Free in-home visit, 12-month warranty, Dubai and Abu Dhabi.",
  path: "/",
});

const featureIcons: Record<HomepageFeature["icon"], typeof Ruler> = {
  ruler: Ruler,
  shield: ShieldCheck,
  sparkles: Sparkles,
  clock: Clock,
};

export default async function HomePage() {
  const [settings, categories, bestsellers, testimonials, partners, faqs] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getBestsellers(),
    getTestimonials(),
    getPartners(),
    getFaqs(),
  ]);
  const home = settings.homepage;
  const hero = home.hero;

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
              <Badge>{hero.badge}</Badge>
            </HeroItem>
            <HeroItem className="mt-6">
              <h1 className="font-serif text-4xl leading-[1.1] text-balance md:text-6xl">{hero.title}</h1>
            </HeroItem>
            <HeroItem className="mt-6">
              <p className="max-w-xl text-lg text-muted-foreground">{hero.subtitle}</p>
            </HeroItem>
            <HeroItem className="mt-6">
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={hero.primary_cta_href}>{hero.primary_cta_label}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={hero.secondary_cta_href}>{hero.secondary_cta_label}</Link>
                </Button>
              </div>
            </HeroItem>
            <HeroItem className="mt-6">
              <p className="text-sm text-muted-foreground">
                Rated {settings.trust.rating}/5 from {settings.trust.reviews.toLocaleString()} reviews · {settings.trust.warranty}
              </p>
            </HeroItem>
          </HeroIntro>
          <HeroVisual src={hero.image_url} alt={hero.image_alt} />
        </div>
      </section>

      <section className="container py-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.features.map((f) => {
            const Icon = featureIcons[f.icon] || Ruler;
            return (
              <StaggerItem key={f.title}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                  <Icon className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
                  <h2 className="font-serif text-xl">{f.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading
            eyebrow={home.collections.eyebrow}
            title={home.collections.title}
            subtitle={home.collections.subtitle || undefined}
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
          <SectionHeading
            eyebrow={home.bestsellers.eyebrow}
            title={home.bestsellers.title}
            subtitle={home.bestsellers.subtitle || undefined}
          />
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
          <SectionHeading
            eyebrow={home.reviews.eyebrow}
            title={home.reviews.title}
            subtitle={home.reviews.subtitle || undefined}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <TestimonialCarousel items={testimonials} />
        </Reveal>
      </section>

      <section className="container py-10">
        <CTABanner
          title={home.cta.title}
          subtitle={home.cta.subtitle}
          buttonLabel={home.cta.button_label}
          buttonHref={home.cta.button_href}
        />
      </section>

      <section className="container space-y-10 py-16">
        <Reveal>
          <SectionHeading
            eyebrow={home.partners.eyebrow}
            title={home.partners.title}
            subtitle={home.partners.subtitle || undefined}
            align="center"
          />
        </Reveal>
        <PartnerLogosStrip logos={partners} />
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow={home.faqs.eyebrow}
            title={home.faqs.title}
            subtitle={home.faqs.subtitle || undefined}
          />
        </Reveal>
        <Reveal delay={0.12}>
          <FAQAccordion items={faqs.slice(0, 5)} />
        </Reveal>
      </section>

      <section className="container max-w-3xl space-y-4 py-16">
        <Reveal>
          <h2 className="font-serif text-3xl">{home.story.title}</h2>
        </Reveal>
        {home.story.paragraphs.map((paragraph, i) => (
          <Reveal key={i} delay={0.08 * (i + 1)}>
            <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
