"use client";

import { useLocale } from "@/components/locale-provider";

export function T({ children }: { children: string }) {
  const { t } = useLocale();
  return <>{t(children)}</>;
}
