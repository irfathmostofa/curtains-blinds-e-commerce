"use client";

import { HtmlContent } from "./html-content";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLocale } from "./locale-provider";
import type { HomepageContent } from "@/lib/types";

export function HowItWorks({ content }: { content: HomepageContent["how_it_works"] }) {
  const { t } = useLocale();
  return (
    <div className="container space-y-10">
      <Reveal>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      </Reveal>
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.steps.map((step) => (
          <StaggerItem key={step.number}>
            <article className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
              <span className="font-serif text-4xl text-brass/70">{step.number}</span>
              <h3 className="mt-4 font-serif text-xl">{t(step.title)}</h3>
              <HtmlContent html={t(step.body)} className="mt-2 text-sm" />
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
