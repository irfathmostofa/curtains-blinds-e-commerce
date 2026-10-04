"use client";

import { Star } from "lucide-react";
import { HtmlContent } from "@/components/html-content";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Testimonial } from "@/lib/types";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <blockquote className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-4 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < item.rating ? "fill-accent text-accent" : "text-border"}`}
          />
        ))}
      </div>
      <HtmlContent html={item.review_text} className="font-serif text-xl leading-snug text-foreground lg:text-2xl" />
      <footer className="mt-6 text-sm text-muted-foreground">
        <cite className="not-italic font-medium text-foreground">{item.customer_name}</cite>
        {` · ${item.source}`}
      </footer>
    </blockquote>
  );
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6" delay={0.07}>
      {items.map((item) => (
        <StaggerItem key={item.id} className="min-w-0 h-full">
          <TestimonialCard item={item} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
