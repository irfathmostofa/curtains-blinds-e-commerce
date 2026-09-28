"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "./locale-provider";

const OUTER =
  "M36 502 L36 190 A 164 164 0 0 1 364 190 L364 502 Z";
const INNER =
  "M56 484 L56 190 A 144 144 0 0 1 344 190 L344 484 Z";
const INMOST =
  "M72 468 L72 190 A 128 128 0 0 1 328 190 L328 468 Z";

const maskSvg = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520"><path fill="white" d="${OUTER}"/></svg>`,
)}")`;

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
      className="relative mx-auto flex w-full max-w-[22rem] items-end justify-center sm:max-w-[26rem] lg:max-w-[28rem]"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: "400 / 520",
          filter: "drop-shadow(0 22px 32px rgba(28, 25, 22, 0.16))",
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            WebkitMaskImage: maskSvg,
            maskImage: maskSvg,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
          >
            {isLocal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
            )}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-brass/10" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: 0, opacity: 0 }}
            animate={reduced ? undefined : { x: ["0%", "420%"], opacity: [0, 0.55, 0] }}
            transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
          />
        </div>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 520"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={OUTER} stroke="#d4b483" strokeWidth="10" />
          <path d={OUTER} stroke="#b0894d" strokeWidth="2.5" />
          <path d={INNER} stroke="#f7f3ec" strokeOpacity="0.85" strokeWidth="2" />
          <path d={INMOST} stroke="#b0894d" strokeOpacity="0.55" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="absolute bottom-[8%] z-20 inset-inline-start-[10%] max-w-[13rem]">
        <div className="rounded-md border border-brass/40 bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm sm:px-4 sm:py-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">{t(expressLabel)}</p>
          <p className="mt-1 font-serif text-sm leading-snug sm:text-base">{t(expressDetail)}</p>
        </div>
      </div>
    </motion.div>
  );
}
