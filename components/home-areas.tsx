"use client";

import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import type { HomepageContent } from "@/lib/types";

export function HomeAreas({ content }: { content: HomepageContent["areas"] }) {
  const { t } = useLocale();
  if (!content.items.length) return null;
  return (
    <div className="container space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle || undefined}
          align="center"
        />
      </Reveal>
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {content.items.map((area) => (
          <StaggerItem key={area}>
            <div className="flex h-full items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>{t(area)}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
