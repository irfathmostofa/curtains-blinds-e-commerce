"use client";

import { useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics/client";

export function ProductViewTracker({
  name,
  slug,
  price,
}: {
  name: string;
  slug: string;
  price: number;
}) {
  useEffect(() => {
    trackClientEvent({
      name: "ViewContent",
      contentName: name,
      contentIds: [slug],
      contentType: "product",
      value: price,
      currency: "AED",
    });
  }, [name, slug, price]);

  return null;
}
