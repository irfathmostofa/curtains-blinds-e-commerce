"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";

type Direction = "up" | "left" | "right" | "scale";

const hidden: Record<Direction, TargetAndTransition> = {
  up: { opacity: 0, y: 36 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
  scale: { opacity: 0, scale: 0.94 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  direction?: Direction;
}) {
  const reduced = useReducedMotion();
  const from = direction === "up" ? { opacity: 0, y } : hidden[direction];
  return (
    <motion.div
      className={className}
      initial={reduced ? false : from}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionFrame({
  id,
  children,
  className,
  tone = "plain",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "plain" | "tint" | "ink";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={
        tone === "tint"
          ? `relative overflow-hidden bg-secondary/50 ${className || ""}`
          : tone === "ink"
            ? `relative overflow-hidden bg-primary text-primary-foreground ${className || ""}`
            : `relative overflow-hidden ${className || ""}`
      }
      initial={reduced ? false : { opacity: 0.55 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
}
