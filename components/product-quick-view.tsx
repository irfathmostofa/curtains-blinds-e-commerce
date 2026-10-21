"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/price-tag";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import { stripHtml } from "@/lib/html";
import type { Product } from "@/lib/types";

export function ProductQuickView({
  product,
  href,
  open,
  onOpenChange,
}: {
  product: Product;
  href: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const image = product.images[0];
  const blurb = stripHtml(product.description);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[min(96vw,56rem)] max-w-3xl min-h-0 flex-col gap-0 overflow-hidden p-0">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] bg-secondary">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.alt || product.name}
                  fill
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="space-y-4 p-5 pr-12 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">{t(product.category?.name || "")}</p>
              <DialogTitle className="font-serif text-2xl leading-snug">{t(product.name)}</DialogTitle>
              {product.is_bestseller ? <Badge className="bg-secondary text-foreground">{t("Bestseller")}</Badge> : null}
              <PriceTag amount={product.base_price} note={t("From")} />
              {blurb ? <p className="line-clamp-5 text-sm leading-relaxed text-muted-foreground">{t(blurb)}</p> : null}
              {product.fabric_options.length ? (
                <p className="text-sm text-muted-foreground">
                  {t("Fabric options")}: {product.fabric_options.map((item) => t(item)).join(" · ")}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-2">
                <ShareButton title={product.name} path={href} />
                <Button asChild size="sm">
                  <Link href={href} onClick={() => onOpenChange(false)}>
                    {t("View full details")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/book">{t("Book a free visit")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
