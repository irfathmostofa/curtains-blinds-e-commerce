"use client";

import type { Partner } from "@/lib/types";

export function PartnerLogosStrip({ logos }: { logos: Partner[] }) {
  const loop = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <ul className="flex w-max animate-marquee gap-4 pr-4 hover:[animation-play-state:paused]">
        {loop.map((logo, i) => (
          <li
            key={`${logo.id}-${i}`}
            className="flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-border bg-card px-4 text-center text-sm font-medium text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
          >
            {logo.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
