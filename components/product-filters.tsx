"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { startNavigationProgress } from "@/components/navigation-progress";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { PRICE_MAX } from "@/lib/catalog-query";
import { cn, formatMoney } from "@/lib/utils";
import { useSiteConfig } from "@/components/site-config";
import type { Category } from "@/lib/types";

type Counts = Record<string, number>;

function buildHref(pathname: string, params: URLSearchParams, overrides: Record<string, string | null>) {
  const next = new URLSearchParams(params.toString());
  Object.entries(overrides).forEach(([key, value]) => {
    if (!value) next.delete(key);
    else next.set(key, value);
  });
  if (!("page" in overrides)) next.delete("page");
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function ProductFilters({
  categories,
  counts,
  total,
  lockedCategory,
}: {
  categories: Category[];
  counts: Counts;
  total: number;
  lockedCategory?: string;
}) {
  const { t } = useLocale();
  const { currency } = useSiteConfig();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const category = lockedCategory || params.get("category") || "";
  const sort = params.get("sort") || "";
  const min = Number(params.get("min") || 0);
  const max = Number(params.get("max") || PRICE_MAX);
  const bestseller = params.get("bestseller") === "1";
  const [priceMax, setPriceMax] = useState(Number.isFinite(max) ? max : PRICE_MAX);

  useEffect(() => {
    setPriceMax(Number.isFinite(max) ? max : PRICE_MAX);
  }, [max]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (!lockedCategory && category) n += 1;
    if (sort) n += 1;
    if (min > 0 || (Number.isFinite(max) && max < PRICE_MAX)) n += 1;
    if (bestseller) n += 1;
    return n;
  }, [bestseller, category, lockedCategory, max, min, sort]);

  function go(overrides: Record<string, string | null>) {
    startNavigationProgress();
    router.push(buildHref(pathname, params, overrides));
    setOpen(false);
  }

  const panel = (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{t("Filters")}</p>
        <h2 className="mt-1 font-serif text-xl leading-tight">{t("Refine")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} {t(total === 1 ? "piece" : "pieces")}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("Category")}
        </legend>
        {lockedCategory ? (
          <p className="rounded-xl bg-secondary px-3 py-2 text-sm">
            {t(categories.find((c) => c.slug === lockedCategory)?.name || lockedCategory)}
          </p>
        ) : (
          <div className="space-y-1">
            <FilterRow
              label={t("All collections")}
              count={Object.values(counts).reduce((a, b) => a + b, 0) || total}
              active={!category}
              onClick={() => go({ category: null })}
            />
            {categories.map((c) => (
              <FilterRow
                key={c.id}
                label={t(c.name)}
                count={counts[c.slug] || 0}
                active={category === c.slug}
                onClick={() => go({ category: c.slug })}
              />
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-2.5">
        <legend className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("Price")}
        </legend>
        <div className="flex items-center justify-between text-sm">
          <span>{formatMoney(0, currency)}</span>
          <span className="font-medium">{formatMoney(priceMax, currency)}</span>
        </div>
        <input
          type="range"
          min={200}
          max={PRICE_MAX}
          step={50}
          value={priceMax}
          aria-label={t("Maximum price")}
          className="h-1.5 w-full max-w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[hsl(var(--accent))]"
          onChange={(e) => setPriceMax(Number(e.target.value))}
          onPointerUp={() => go({ max: priceMax >= PRICE_MAX ? null : String(priceMax), min: null })}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
              go({ max: priceMax >= PRICE_MAX ? null : String(priceMax), min: null });
            }
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {[400, 800, 1200].map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => {
                setPriceMax(cap);
                go({ max: String(cap), min: null });
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] transition",
                max === cap ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/40"
              )}
            >
              {t("Under")} {formatMoney(cap, currency)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("Highlights")}
        </legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm hover:bg-secondary/60">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[hsl(var(--accent))]"
            checked={bestseller}
            onChange={(e) => go({ bestseller: e.target.checked ? "1" : null })}
          />
          {t("Bestsellers only")}
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("Sort")}
        </legend>
        {[
          { value: "", label: t("Featured") },
          { value: "price-asc", label: t("Price: low to high") },
          { value: "price-desc", label: t("Price: high to low") },
          { value: "name", label: t("Name A–Z") },
        ].map((opt) => (
          <FilterRow
            key={opt.value || "featured"}
            label={opt.label}
            active={sort === opt.value}
            onClick={() => go({ sort: opt.value || null })}
          />
        ))}
      </fieldset>

      {activeCount ? (
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => go({ category: lockedCategory || null, sort: null, min: null, max: null, bestseller: null, page: null })}>
          {t("Clear filters")}
        </Button>
      ) : null}
    </div>
  );

  return (
    <>
      <aside className="hidden min-w-0 lg:block">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm xl:p-5">{panel}</div>
      </aside>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm text-muted-foreground">
          {total} {t(total === 1 ? "piece" : "pieces")}
        </p>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          {t("Filters")}
          {activeCount ? (
            <span className="rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">{activeCount}</span>
          ) : null}
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label={t("Close filters")} onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col overflow-y-auto border-r border-border bg-background p-5 shadow-xl rtl:left-auto rtl:right-0 rtl:border-l rtl:border-r-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-lg">{t("Filters")}</p>
              <Button type="button" variant="ghost" size="icon" aria-label={t("Close filters")} onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {panel}
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      {typeof count === "number" ? (
        <span className={cn("shrink-0 text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{count}</span>
      ) : null}
    </button>
  );
}
