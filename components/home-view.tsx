"use client";

import { type ReactNode } from "react";
import { CategoryCard } from "@/components/category-card";
import { CTABanner } from "@/components/cta-banner";
import { FAQAccordion } from "@/components/faq-accordion";
import { PartnerLogosStrip } from "@/components/partner-logos-strip";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { JsonLd } from "@/components/json-ld";
import { ShieldCheck, Ruler, Sparkles, Clock } from "lucide-react";
import { HeroClassic } from "@/components/hero-classic";
import { HeroCarousel } from "@/components/hero-carousel";
import { HowItWorks } from "./how-it-works";
import { HomeIntro } from "./home-intro";
import { MarqueeStrip } from "./marquee-strip";
import { Reveal, SectionFrame, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HtmlContent } from "./html-content";
import { FilteredProducts } from "@/components/filtered-products";
import { useLocale } from "./locale-provider";
import type { HomepageFeature, HomepageSectionId } from "@/lib/types";
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
  products,
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
  products: Product[];
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
  const classicSlide = {
    badge: hero.badge,
    title: hero.title,
    subtitle: hero.subtitle,
    primary_cta_label: hero.primary_cta_label,
    primary_cta_href: hero.primary_cta_href,
    secondary_cta_label: hero.secondary_cta_label,
    secondary_cta_href: hero.secondary_cta_href,
    image_url: hero.image_url,
    image_alt: hero.image_alt,
    express_label: hero.express_label,
    express_detail: hero.express_detail,
  };

  const sections: Record<HomepageSectionId, ReactNode> = {
    hero:
      hero.variant === "carousel" ? (
        <HeroCarousel slides={home.hero_slides} autoplayMs={hero.autoplay_ms} />
      ) : (
        <HeroClassic slide={classicSlide} settings={settings} />
      ),
    marquee: <MarqueeStrip items={home.marquee} />,
    intro: (
      <SectionFrame className="py-0">
        <HomeIntro content={home.intro} />
      </SectionFrame>
    ),
    how_it_works: (
      <SectionFrame className="py-14 sm:py-16">
        <HowItWorks content={home.how_it_works} />
      </SectionFrame>
    ),
    features: (
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
    ),
    collections: (
      <SectionFrame tone="tint" className="py-14 sm:py-16">
        <div className="container space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow={home.collections.eyebrow}
              title={home.collections.title}
              subtitle={home.collections.subtitle || undefined}
            />
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {categories.map((c) => (
              <StaggerItem key={c.id} className="min-w-0">
                <CategoryCard category={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionFrame>
    ),
    filtered_products: (
      <SectionFrame>
        <FilteredProducts copy={home.filtered_products} categories={categories} products={products} />
      </SectionFrame>
    ),
    bestsellers: (
      <SectionFrame className="container space-y-10 py-14 sm:py-16">
        <Reveal direction="left">
          <SectionHeading
            eyebrow={home.bestsellers.eyebrow}
            title={home.bestsellers.title}
            subtitle={home.bestsellers.subtitle || undefined}
          />
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6" delay={0.07}>
          {bestsellers.map((p) => (
            <StaggerItem key={p.id} className="min-w-0">
              <ProductCard product={p} compact />
            </StaggerItem>
          ))}
        </Stagger>
      </SectionFrame>
    ),
    reviews: (
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
    ),
    cta: (
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
    ),
    partners: (
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
    ),
    faqs: (
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
    ),
    story: (
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
    ),
  };

  return (
    <main className="overflow-x-hidden">
      <JsonLd data={orgJson} />
      {localJson.map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <JsonLd data={faqJson} />

      {home.section_order
        .filter((section) => section.enabled)
        .map((section) => (
          <div key={section.id}>{sections[section.id]}</div>
        ))}
    </main>
  );
}
