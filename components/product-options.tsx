"use client";

import { useState } from "react";
import { PriceTag } from "@/components/price-tag";
import { VariantSelector } from "@/components/variant-selector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useSiteConfig } from "@/components/site-config";
import { formatMoney } from "@/lib/utils";

export function ProductOptions({ product }: { product: Product }) {
  const { currency, showProductPrices } = useSiteConfig();
  const variants = product.variants || [];
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [fabric, setFabric] = useState(product.fabric_options[0]);
  const selected = variants.find((v) => v.id === variantId);
  const price = selected?.price ?? product.base_price;

  return (
    <div className="space-y-8">
      {showProductPrices ? <PriceTag amount={price} /> : null}
      {variants.length ? (
        <VariantSelector
          label="Size & specification"
          variants={variants.map((v) => ({
            id: v.id,
            label: showProductPrices ? `${v.size_label} · ${formatMoney(v.price, currency)}` : v.size_label,
          }))}
          value={variantId}
          onSelect={setVariantId}
        />
      ) : null}
      {product.fabric_options.length ? (
        <VariantSelector
          label="Fabric options"
          variants={product.fabric_options.map((f) => ({ id: f, label: f }))}
          value={fabric}
          onSelect={setFabric}
        />
      ) : null}
      {variants.length ? (
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <caption className="sr-only">{showProductPrices ? "Price table" : "Specification table"}</caption>
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Specification</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              {showProductPrices ? <th className="px-4 py-3 font-medium">Price ({currency})</th> : null}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-3">{v.size_label}</td>
                <td className="px-4 py-3">{v.sku}</td>
                {showProductPrices ? <td className="px-4 py-3">{formatMoney(v.price, currency)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/book">Book a free visit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/get-estimate">Get an estimate</Link>
        </Button>
      </div>
    </div>
  );
}
