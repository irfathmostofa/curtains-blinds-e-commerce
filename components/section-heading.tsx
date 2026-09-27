"use client";

import { HtmlContent } from "@/components/html-content";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  const Heading = as;
  const { t } = useLocale();
  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t(eyebrow)}</p>
      ) : null}
      <Heading className="text-balance text-3xl md:text-4xl">{t(title)}</Heading>
      {subtitle ? <HtmlContent html={t(subtitle)} /> : null}
    </div>
  );
}
