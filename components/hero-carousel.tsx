"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/hero-visual";
import { HtmlContent } from "@/components/html-content";
import { useLocale } from "@/components/locale-provider";
import type { HeroSlide, SiteSettings } from "@/lib/types";

export function HeroCarousel({
  slides,
  settings,
  autoplayMs = 6500,
}: {
  slides: HeroSlide[];
  settings: SiteSettings;
  autoplayMs?: number;
}) {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const items = slides.filter((s) => s.title || s.image_url);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number, direction?: number) => {
      if (!items.length) return;
      const wrapped = (next + items.length) % items.length;
      setDir(direction ?? (wrapped > index ? 1 : -1));
      setIndex(wrapped);
    },
    [index, items.length]
  );

  useEffect(() => {
    if (reduced || paused || items.length < 2) return;
    const id = window.setInterval(() => go(index + 1, 1), Math.max(autoplayMs, 2500));
    return () => window.clearInterval(id);
  }, [autoplayMs, go, index, items.length, paused, reduced]);

  if (!items.length) return null;
  const slide = items[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label={t("Homepage hero")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
      <div className="container relative grid min-h-[calc(100dvh-4.25rem)] items-center gap-10 py-8 pb-20 sm:gap-12 sm:py-8 sm:pb-24 lg:grid-cols-2 lg:py-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`${index}-${slide.title}`}
            custom={dir}
            initial={reduced ? false : { opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: dir * -48 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-center gap-10 lg:col-span-2 lg:grid-cols-2"
          >
            <div className="flex h-full flex-col justify-center pb-4 lg:pb-8">
              <Badge>{t(slide.badge)}</Badge>
              <h1 className="mt-4 text-balance font-serif text-[1.85rem] leading-[1.15] sm:mt-6 sm:text-4xl md:text-6xl">
                {t(slide.title)}
              </h1>
              <HtmlContent html={t(slide.subtitle)} className="mt-4 max-w-xl text-base sm:mt-6 sm:text-lg" />
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={slide.primary_cta_href}>{t(slide.primary_cta_label)}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={slide.secondary_cta_href}>{t(slide.secondary_cta_label)}</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground sm:mt-6">
                {t("Rated")} {settings.trust.rating}/5 {t("from")} {settings.trust.reviews.toLocaleString()} {t("reviews")} ·{" "}
                {t(settings.trust.warranty)}
              </p>
            </div>
            <HeroVisual
              src={slide.image_url}
              alt={t(slide.image_alt)}
              expressLabel={slide.express_label}
              expressDetail={slide.express_detail}
            />
          </motion.div>
        </AnimatePresence>

        {items.length > 1 ? (
          <div className="absolute inset-x-4 bottom-6 z-10 flex items-center justify-between gap-3 sm:inset-x-8 lg:bottom-8">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t("Previous slide")}
                onClick={() => go(index - 1, -1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t("Next slide")}
                onClick={() => go(index + 1, 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2" role="tablist" aria-label={t("Hero slides")}>
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${t("Slide")} ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-accent" : "w-2 bg-border hover:bg-accent/50"
                  }`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
