"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { PriceTag } from "@/components/price-tag";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const href = `/products/${product.category?.slug || "curtains-and-drapes"}/${product.slug}`;
  const image = product.images[0];
  const { t } = useLocale();

  return (
    <article
      className={
        compact
          ? "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          : "group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
      }
    >
      <Link href={href} className="flex h-full flex-col">
        <div className={compact ? "relative aspect-[5/4] overflow-hidden bg-secondary" : "relative aspect-[4/5] overflow-hidden bg-secondary"}>
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes={compact ? "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition duration-700 ease-out group-hover:scale-110"
            />
          ) : null}
          {product.is_bestseller ? (
            <Badge className={compact ? "absolute left-2 top-2 bg-card/90 text-[10px]" : "absolute left-3 top-3 bg-card/90"}>
              {t("Bestseller")}
            </Badge>
          ) : null}
        </div>
        <div className={compact ? "flex flex-1 flex-col gap-0.5 p-2.5 sm:p-3" : "space-y-2 p-5"}>
          <h3
            className={
              compact
                ? "line-clamp-2 font-serif text-sm leading-snug transition-colors group-hover:text-accent sm:text-[15px]"
                : "font-serif text-xl leading-snug transition-colors group-hover:text-accent"
            }
          >
            {t(product.name)}
          </h3>
          <PriceTag amount={product.base_price} note={t("From")} />
          {compact ? null : (
            <p className="text-sm font-medium text-accent transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {t("View details")}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
