"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALE_COOKIE, localeDir, translate, type Locale } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (value: string) => string;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

function persist(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDir(locale);
  document.documentElement.classList.toggle("locale-ar", locale === "ar");
}

export function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  useEffect(() => {
    persist(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persist(next);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      dir: localeDir(locale),
      t: (value: string) => translate(locale, value),
      setLocale,
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      dir: "ltr" as const,
      t: (value: string) => value,
      setLocale: () => undefined,
    };
  }
  return ctx;
}
