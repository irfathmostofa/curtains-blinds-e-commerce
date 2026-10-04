"use client";

import { useLocale } from "./locale-provider";

export function MarqueeStrip({ items }: { items: string[] }) {
  const { t } = useLocale();
  const loop = [...items, ...items];
  if (!items.length) return null;
  return (
    <div className="relative overflow-hidden border-y border-border bg-primary text-ivory">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-primary to-transparent" />
      <ul className="flex w-max animate-marquee items-center gap-0 py-3 pr-8 hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 px-4 text-sm font-medium tracking-wide"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-brass"
              aria-hidden="true"
            />
            <span>{t(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
