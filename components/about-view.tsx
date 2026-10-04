"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { CTABanner } from "@/components/cta-banner";
import { HomeIntro } from "@/components/home-intro";
import { HtmlContent } from "@/components/html-content";
import { Reveal, SectionFrame, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/components/locale-provider";
import type { AboutContent, AboutSectionId } from "@/lib/types";

export function AboutView({ about }: { about: AboutContent }) {
  const { t } = useLocale();

  const sections: Record<AboutSectionId, ReactNode> = {
    intro: (
      <SectionFrame className="py-0">
        <HomeIntro content={about.intro} headingAs="h1" />
      </SectionFrame>
    ),
    mission_vision: (
      <SectionFrame tone="tint" className="py-14 sm:py-16">
        <div className="container space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow={about.mission_vision.eyebrow}
              title={about.mission_vision.title}
              subtitle={about.mission_vision.subtitle || undefined}
            />
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h3 className="font-serif text-2xl">{t(about.mission_vision.mission_title)}</h3>
                <HtmlContent html={t(about.mission_vision.mission_body)} className="mt-4" />
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h3 className="font-serif text-2xl">{t(about.mission_vision.vision_title)}</h3>
                <HtmlContent html={t(about.mission_vision.vision_body)} className="mt-4" />
              </article>
            </Reveal>
          </div>
        </div>
      </SectionFrame>
    ),
    team: (
      <SectionFrame className="py-14 sm:py-16">
        <div className="container space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow={about.team.eyebrow}
              title={about.team.title}
              subtitle={about.team.subtitle || undefined}
            />
          </Reveal>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.team.members
              .filter((member) => member.name.trim())
              .map((member) => {
                const imageUrl = member.image_url?.trim();
                const isLocal = Boolean(imageUrl && (imageUrl.startsWith("data:") || imageUrl.startsWith("/")));
                return (
                  <StaggerItem key={`${member.name}-${member.role}`}>
                    <article className="h-full overflow-hidden rounded-3xl border border-border bg-card">
                      {imageUrl ? (
                        <div className="relative aspect-[4/5] overflow-hidden">
                          {isLocal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={t(member.image_alt) || member.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Image
                              src={imageUrl}
                              alt={t(member.image_alt) || member.name}
                              fill
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ) : null}
                      <div className="space-y-2 p-5 sm:p-6">
                        <h3 className="font-serif text-xl">{t(member.name)}</h3>
                        {member.role ? (
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            {t(member.role)}
                          </p>
                        ) : null}
                        {member.bio ? <HtmlContent html={t(member.bio)} className="text-sm" /> : null}
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
          </Stagger>
        </div>
      </SectionFrame>
    ),
    cta: (
      <SectionFrame className="container py-10">
        <Reveal direction="scale">
          <CTABanner
            title={t(about.cta.title)}
            subtitle={t(about.cta.subtitle)}
            buttonLabel={t(about.cta.button_label)}
            buttonHref={about.cta.button_href}
          />
        </Reveal>
      </SectionFrame>
    ),
  };

  return (
    <>
      {about.section_order
        .filter((section) => section.enabled)
        .map((section) => (
          <div key={section.id}>{sections[section.id]}</div>
        ))}
    </>
  );
}
