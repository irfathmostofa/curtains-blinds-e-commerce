"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import type { HeroSlide } from "@/lib/types";

export function HeroCarousel({
  slides,
  autoplayMs = 6500,
}: {
  slides: HeroSlide[];
  autoplayMs?: number;
}) {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const items = slides.filter((s) => s.image_url);
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
  const isLocal = slide.image_url.startsWith("data:") || slide.image_url.startsWith("/");

  return (
    <section
      className="relative overflow-hidden bg-secondary"
      aria-roledescription="carousel"
      aria-label={t("Homepage hero")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[300px] w-full sm:h-[min(70dvh,40rem)] lg:h-[min(88dvh,52rem)]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`${index}-${slide.image_url}`}
            custom={dir}
            initial={reduced ? false : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {isLocal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.image_url} alt={t(slide.image_alt) || t("Homepage hero")} className="h-full w-full object-cover" />
            ) : (
              <Image
                src={slide.image_url}
                alt={t(slide.image_alt) || t("Homepage hero")}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              aria-label={t("Previous slide")}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-card/90 shadow-md sm:left-6"
              onClick={() => go(index - 1, -1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t("Next slide")}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-card/90 shadow-md sm:right-6"
              onClick={() => go(index + 1, 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div
              className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2"
              role="tablist"
              aria-label={t("Hero slides")}
            >
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${t("Slide")} ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
