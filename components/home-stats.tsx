"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import type { HomepageContent } from "@/lib/types";

function digitsOnly(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function CountUp({ value, suffix }: { value: string; suffix: string }) {
  const target = digitsOnly(value);
  const [n, setN] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-serif text-4xl md:text-5xl">
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HomeStats({ content }: { content: HomepageContent["stats"] }) {
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
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {content.items.map((item) => (
          <StaggerItem key={item.label}>
            <div className="h-full rounded-2xl border border-border bg-card px-4 py-6 text-center">
              <CountUp value={item.value} suffix={item.suffix} />
              <p className="mt-2 text-sm text-muted-foreground">{t(item.label)}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
