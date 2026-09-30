"use client";

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

  return (
    <div className="container max-w-4xl space-y-6 py-14 sm:py-16">
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
  );
}
