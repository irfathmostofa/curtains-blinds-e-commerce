"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HtmlContent } from "@/components/html-content";
import { useLocale } from "@/components/locale-provider";
import type { Testimonial } from "@/lib/types";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const { t } = useLocale();
  if (!items.length) return null;
  const item = items[index];

  function go(next: number) {
    setDir(next > index || (index === items.length - 1 && next === 0) ? 1 : -1);
    setIndex(next);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12" aria-roledescription="carousel">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.blockquote
          key={item.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < item.rating ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <HtmlContent html={item.review_text} className="font-serif text-2xl leading-snug text-foreground" />
          <footer className="mt-6 text-sm text-muted-foreground">
            <cite className="not-italic font-medium text-foreground">{item.customer_name}</cite>
            {` · ${item.source}`}
          </footer>
        </motion.blockquote>
      </AnimatePresence>
      <div className="mt-8 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("Previous testimonial")}
          onClick={() => go(index === 0 ? items.length - 1 : index - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("Next testimonial")}
          onClick={() => go(index === items.length - 1 ? 0 : index + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
