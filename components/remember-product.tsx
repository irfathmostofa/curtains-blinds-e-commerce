"use client";

import { useEffect } from "react";
import { rememberProduct } from "@/app/actions";

export function RememberProduct({ slug }: { slug: string }) {
  useEffect(() => {
    void rememberProduct(slug);
  }, [slug]);
  return null;
}
