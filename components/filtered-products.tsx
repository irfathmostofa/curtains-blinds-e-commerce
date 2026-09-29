"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import type { Category, HomepageContent, Product } from "@/lib/types";

type Tab = { id: string; label: string };

export function FilteredProducts({
  copy,
  categories,
  products,
}: {
  copy: HomepageContent["filtered_products"];
  categories: Category[];
  products: Product[];
}) {
  const { t } = useLocale();
  const tabs = useMemo<Tab[]>(() => {
    const next: Tab[] = [];
    if (copy.show_all_tab !== false) next.push({ id: "all", label: t("All") });
    if (copy.show_bestsellers_tab !== false) next.push({ id: "bestsellers", label: t("Bestsellers") });
    categories.forEach((c) => next.push({ id: c.slug, label: t(c.name) }));
    return next;
  }, [categories, copy.show_all_tab, copy.show_bestsellers_tab, t]);

  const [active, setActive] = useState(tabs[0]?.id || "all");
  const limit = copy.limit > 0 ? copy.limit : 8;

  const visible = useMemo(() => {
    let list = products.filter((p) => p.is_active !== false);
    if (active === "bestsellers") list = list.filter((p) => p.is_bestseller);
    else if (active !== "all") list = list.filter((p) => p.category?.slug === active);
    return list.slice(0, limit);
  }, [active, limit, products]);

  if (!products.length) return null;

  return (
    <div className="container space-y-8 py-14 sm:py-16">
      <Reveal>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle || undefined} />
      </Reveal>
      {tabs.length ? (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2" role="tablist" aria-label={t("Product filters")}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  active === tab.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {visible.length ? (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={0.07}>
          {visible.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="text-sm text-muted-foreground">{t("No pieces in this filter yet.")}</p>
      )}
    </div>
  );
}
