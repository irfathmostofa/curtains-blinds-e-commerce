"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import type { Category, HomepageContent, Product } from "@/lib/types";

type Tab = { id: string; label: string };

function descendantIds(categories: Category[], slug: string): Set<string> {
  const root = categories.find((c) => c.slug === slug);
  if (!root) return new Set();
  const ids = new Set<string>([root.id]);
  let growing = true;
  while (growing) {
    growing = false;
    for (const category of categories) {
      if (category.parent_id && ids.has(category.parent_id) && !ids.has(category.id)) {
        ids.add(category.id);
        growing = true;
      }
    }
  }
  return ids;
}

function filterProducts(
  products: Product[],
  categories: Category[],
  active: string
): Product[] {
  const list = products.filter((p) => p.is_active !== false);
  if (active === "all") return list;
  if (active === "bestsellers") return list.filter((p) => p.is_bestseller);
  const ids = descendantIds(categories, active);
  if (!ids.size) return [];
  return list.filter((p) => ids.has(p.category_id));
}

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
  const catalog = useMemo(() => products.filter((p) => p.is_active !== false), [products]);
  const limit = copy.limit > 0 ? copy.limit : 8;

  const tabs = useMemo<Tab[]>(() => {
    const next: Tab[] = [];
    if (copy.show_all_tab !== false) next.push({ id: "all", label: t("All") });
    if (copy.show_bestsellers_tab !== false && catalog.some((p) => p.is_bestseller)) {
      next.push({ id: "bestsellers", label: t("Bestsellers") });
    }
    categories.forEach((category) => {
      const ids = descendantIds(categories, category.slug);
      const hasItems = catalog.some((p) => ids.has(p.category_id));
      if (hasItems) next.push({ id: category.slug, label: t(category.name) });
    });
    return next;
  }, [catalog, categories, copy.show_all_tab, copy.show_bestsellers_tab, t]);

  const [active, setActive] = useState(tabs[0]?.id || "all");
  const current = tabs.some((tab) => tab.id === active) ? active : tabs[0]?.id || "all";
  const matches = useMemo(
    () => filterProducts(catalog, categories, current),
    [catalog, categories, current]
  );
  const visible = matches.slice(0, limit);

  if (!catalog.length || !tabs.length) return null;

  return (
    <div className="container space-y-8 py-14 sm:py-16">
      <Reveal>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle || undefined} />
      </Reveal>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("Product filters")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={current === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              current === tab.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-accent/40"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {visible.length ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.p
            key={`${current}-empty`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            {t("No pieces in this filter yet.")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
