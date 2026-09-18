"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroVisual({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl"
      initial={reduced ? false : { opacity: 0, scale: 0.96, x: 24 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        {src.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/25 via-transparent to-brass/10" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: 0, opacity: 0 }}
        animate={reduced ? undefined : { x: ["0%", "420%"], opacity: [0, 0.7, 0] }}
        transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
