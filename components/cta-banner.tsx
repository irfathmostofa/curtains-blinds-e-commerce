"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTABanner({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
}: {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  buttonHref: string;
}) {
  return (
    <motion.section
      className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl space-y-2">
          <h2 className="font-serif text-3xl">{title}</h2>
          {subtitle ? <p className="text-primary-foreground/80">{subtitle}</p> : null}
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <Button asChild variant="secondary" size="lg">
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
