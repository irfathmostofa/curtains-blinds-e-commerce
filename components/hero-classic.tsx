"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroIntro, HeroItem } from "@/components/hero-intro";
import { HeroVisual } from "@/components/hero-visual";
import { HtmlContent } from "@/components/html-content";
import { useLocale } from "@/components/locale-provider";
import type { HeroSlide, SiteSettings } from "@/lib/types";

export function HeroClassic({
  slide,
  settings,
}: {
  slide: HeroSlide;
  settings: SiteSettings;
}) {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
      <div className="container grid min-h-[calc(100dvh-4.25rem)] items-center gap-10 pt-4 pb-10 sm:gap-12 sm:pt-6 sm:pb-16 lg:grid-cols-2 lg:pt-4">
        <HeroIntro>
          <div className="flex h-full flex-col justify-center pb-4 lg:pb-8">
            <HeroItem>
              <Badge>{t(slide.badge)}</Badge>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <h1 className="text-balance font-serif text-[1.85rem] leading-[1.15] sm:text-4xl md:text-6xl">
                {t(slide.title)}
              </h1>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <HtmlContent html={t(slide.subtitle)} className="max-w-xl text-base sm:text-lg" />
            </HeroItem>
            <HeroItem className="mt-5 sm:mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={slide.primary_cta_href}>{t(slide.primary_cta_label)}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={slide.secondary_cta_href}>{t(slide.secondary_cta_label)}</Link>
                </Button>
              </div>
            </HeroItem>
            <HeroItem className="mt-4 sm:mt-6">
              <p className="text-sm text-muted-foreground">
                {t("Rated")} {settings.trust.rating}/5 {t("from")} {settings.trust.reviews.toLocaleString()} {t("reviews")} ·{" "}
                {t(settings.trust.warranty)}
              </p>
            </HeroItem>
          </div>
        </HeroIntro>
        <HeroVisual
          src={slide.image_url}
          alt={t(slide.image_alt)}
          expressLabel={slide.express_label}
          expressDetail={slide.express_detail}
        />
      </div>
    </section>
  );
}
