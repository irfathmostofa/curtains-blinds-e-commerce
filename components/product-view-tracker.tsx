"use client";

import { useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics/client";

export function ProductViewTracker({
  name,
  slug,
  price,
  currency = "AED",
}: {
  name: string;
  slug: string;
  price: number;
  currency?: string;
}) {
  useEffect(() => {
    trackClientEvent({
      name: "ViewContent",
      contentName: name,
      contentIds: [slug],
      contentType: "product",
      value: price,
      currency,
    });
  }, [name, slug, price, currency]);

  return null;
}
