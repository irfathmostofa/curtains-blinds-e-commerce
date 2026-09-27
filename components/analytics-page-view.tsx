"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics/client";

export function AnalyticsPageView() {
  const pathname = usePathname();
  const search = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    const path = `${pathname}${search?.toString() ? `?${search.toString()}` : ""}`;
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView(path);
  }, [pathname, search]);

  return null;
}
