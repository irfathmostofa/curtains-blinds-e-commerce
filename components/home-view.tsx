"use client";

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
import { JsonLd } from "@/components/json-ld";
import { ShieldCheck, Ruler, Sparkles, Clock } from "lucide-react";
import { HeroIntro, HeroItem } from "@/components/hero-intro";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal, SectionFrame, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HtmlContent } from "@/components/html-content";
import { useLocale } from "@/components/locale-provider";
import type { HomepageFeature } from "@/lib/types";
import type { Category, Faq, Partner, Product, SiteSettings, Testimonial } from "@/lib/types";

const featureIcons: Record<HomepageFeature["icon"], typeof Ruler> = {
  ruler: Ruler,
  shield: ShieldCheck,
  sparkles: Sparkles,
  clock: Clock,
};

export function HomeView({
  settings,
  categories,
  bestsellers,
  testimonials,
  partners,
  faqs,
  orgJson,
  localJson,
  faqJson,
}: {
  settings: SiteSettings;
  categories: Category[];
  bestsellers: Product[];
  testimonials: Testimonial[];
  partners: Partner[];
  faqs: Faq[];
  orgJson: Record<string, unknown>;
  localJson: Record<string, unknown>[];
  faqJson: Record<string, unknown> | Record<string, unknown>[];
}) {
  const { t } = useLocale();
  const home = settings.homepage;
  const hero = home.hero;

  return (
    <main className="overflow-x-hidden">
      <JsonLd data={orgJson} />
      {localJson.map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <JsonLd data={faqJson} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
        <div className="container grid min-h-[calc(100dvh-4.25rem)] items-center gap-8 py-8 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:py-20">
          <HeroIntro>
            <HeroItem>
              <Badge>{t(hero.badge)}</Badge>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <h1 className="text-balance font-serif text-[1.85rem] leading-[1.15] sm:text-4xl md:text-6xl">
                {t(hero.title)}
              </h1>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <HtmlContent html={t(hero.subtitle)} className="max-w-xl text-base sm:text-lg" />
            </HeroItem>
            <HeroItem className="mt-5 sm:mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={hero.primary_cta_href}>{t(hero.primary_cta_label)}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={hero.secondary_cta_href}>{t(hero.secondary_cta_label)}</Link>
                </Button>
              </div>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <p className="text-sm text-muted-foreground">
                {t("Rated")} {settings.trust.rating}/5 {t("from")} {settings.trust.reviews.toLocaleString()} {t("reviews")} ·{" "}
                {t(settings.trust.warranty)}
              </p>
            </HeroItem>
          </HeroIntro>
          <HeroVisual src={hero.image_url} alt={t(hero.image_alt)} />
        </div>
      </section>

      <SectionFrame className="container py-8 sm:py-12">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.features.map((f) => {
            const Icon = featureIcons[f.icon] || Ruler;
            return (
              <StaggerItem key={f.title}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                  <Icon className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
                  <h2 className="font-serif text-xl">{t(f.title)}</h2>
                  <HtmlContent html={t(f.body)} className="mt-2 text-sm" />
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </SectionFrame>

      <SectionFrame tone="tint" className="py-14 sm:py-16">
        <div className="container space-y-10">
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
        </div>
      </SectionFrame>

      <SectionFrame className="container space-y-10 py-14 sm:py-16">
        <Reveal direction="left">
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
      </SectionFrame>

      <SectionFrame tone="tint" className="py-14 sm:py-16">
        <div className="container space-y-10">
          <Reveal direction="right">
            <SectionHeading
              eyebrow={home.reviews.eyebrow}
              title={home.reviews.title}
              subtitle={home.reviews.subtitle || undefined}
            />
          </Reveal>
          <Reveal delay={0.1} direction="scale">
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </div>
      </SectionFrame>

      <SectionFrame className="container py-10">
        <Reveal direction="scale">
          <CTABanner
            title={t(home.cta.title)}
            subtitle={t(home.cta.subtitle)}
            buttonLabel={t(home.cta.button_label)}
            buttonHref={home.cta.button_href}
          />
        </Reveal>
      </SectionFrame>

      <SectionFrame className="container space-y-10 py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow={home.partners.eyebrow}
            title={home.partners.title}
            subtitle={home.partners.subtitle || undefined}
            align="center"
          />
        </Reveal>
        <PartnerLogosStrip logos={partners} />
      </SectionFrame>

      <SectionFrame tone="tint" className="py-14 sm:py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <SectionHeading
              eyebrow={home.faqs.eyebrow}
              title={home.faqs.title}
              subtitle={home.faqs.subtitle || undefined}
            />
          </Reveal>
          <Reveal delay={0.12} direction="right">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </Reveal>
        </div>
      </SectionFrame>

      <SectionFrame className="container max-w-3xl space-y-4 py-14 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-3xl">{t(home.story.title)}</h2>
        </Reveal>
        {home.story.paragraphs.map((paragraph, i) => (
          <Reveal key={i} delay={0.08 * (i + 1)}>
            <HtmlContent html={t(paragraph)} />
          </Reveal>
        ))}
      </SectionFrame>
    </main>
  );
}
