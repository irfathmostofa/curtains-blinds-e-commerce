"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HtmlContent } from "@/components/html-content";
import { Reveal } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import type { HomepageContent } from "@/lib/types";

export function HomeIntro({ content }: { content: HomepageContent["intro"] }) {
  const { t } = useLocale();
  const hasPrimary = Boolean(content.primary_cta_label && content.primary_cta_href);
  const hasSecondary = Boolean(content.secondary_cta_label && content.secondary_cta_href);
  const imageUrl = content.image_url?.trim();
  const isLocal = Boolean(imageUrl && (imageUrl.startsWith("data:") || imageUrl.startsWith("/")));

  return (
    <div className="container py-14 sm:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <Reveal>
            {content.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t(content.eyebrow)}</p>
            ) : null}
            <h2 className="mt-3 text-balance font-serif text-3xl leading-[1.15] sm:text-4xl md:text-5xl">
              {t(content.title)}
            </h2>
          </Reveal>
          {content.subtitle ? (
            <Reveal delay={0.08}>
              <HtmlContent html={t(content.subtitle)} className="max-w-2xl text-base sm:text-lg" />
            </Reveal>
          ) : null}
          {hasPrimary || hasSecondary ? (
            <Reveal delay={0.16}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {hasPrimary ? (
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={content.primary_cta_href}>{t(content.primary_cta_label)}</Link>
                  </Button>
                ) : null}
                {hasSecondary ? (
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link href={content.secondary_cta_href}>{t(content.secondary_cta_label)}</Link>
                  </Button>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
        {imageUrl ? (
          <Reveal delay={0.1} direction="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-lg sm:aspect-[5/4] lg:aspect-[4/5]">
              {isLocal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={t(content.image_alt) || content.image_alt} className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={t(content.image_alt) || content.image_alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
