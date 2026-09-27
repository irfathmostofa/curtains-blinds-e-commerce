"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "./locale-provider";

export function HeroVisual({
  src,
  alt,
  expressLabel,
  expressDetail,
}: {
  src: string;
  alt: string;
  expressLabel: string;
  expressDetail: string;
}) {
  const reduced = useReducedMotion();
  const { t } = useLocale();
  const isLocal = src.startsWith("data:") || src.startsWith("/");
  return (
    <motion.div
      className="relative flex h-full min-h-[320px] w-full items-stretch sm:min-h-[400px] lg:min-h-0"
      initial={reduced ? false : { opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-6 top-6 h-28 w-28 rounded-full border border-brass/40 sm:-right-8 sm:h-36 sm:w-36"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -left-4 h-24 w-24 rounded-[2rem] bg-brass/15 sm:h-32 sm:w-32"
      />
      <div
        aria-hidden="true"
        className="absolute right-8 top-1/3 h-16 w-16 rotate-12 rounded-2xl border border-accent/30"
      />

      <div className="relative h-full min-h-[320px] w-full overflow-hidden shadow-2xl sm:min-h-[400px] lg:min-h-full [clip-path:polygon(8%_0%,92%_4%,100%_18%,98%_86%,86%_100%,10%_96%,0%_80%,3%_12%)]">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        >
          {isLocal ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          )}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-brass/15" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: 0, opacity: 0 }}
          animate={reduced ? undefined : { x: ["0%", "420%"], opacity: [0, 0.7, 0] }}
          transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute -bottom-3 left-3 z-10 sm:-bottom-4 sm:left-0">
        <div className="rounded-2xl border border-brass/30 bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:px-5 sm:py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">{t(expressLabel)}</p>
          <p className="mt-1 font-serif text-base leading-tight sm:text-lg">{t(expressDetail)}</p>
        </div>
      </div>
    </motion.div>
  );
}
