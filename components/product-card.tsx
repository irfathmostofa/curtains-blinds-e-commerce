"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { PriceTag } from "@/components/price-tag";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.category?.slug || "curtains-and-drapes"}/${product.slug}`;
  const image = product.images[0];
  const { t } = useLocale();

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-110"
            />
          ) : null}
          {product.is_bestseller ? (
            <Badge className="absolute left-3 top-3 bg-card/90">{t("Bestseller")}</Badge>
          ) : null}
        </div>
        <div className="space-y-2 p-5">
          <h3 className="font-serif text-xl leading-snug transition-colors group-hover:text-accent">{t(product.name)}</h3>
          <PriceTag amount={product.base_price} note={t("From")} />
          <p className="text-sm font-medium text-accent transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            {t("View details")}
          </p>
        </div>
      </Link>
    </article>
  );
}
