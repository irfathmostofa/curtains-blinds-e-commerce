"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SETTINGS } from "@/lib/site";
import type { BudgetOption, FormOption } from "@/lib/types";

export type SiteConfigValue = {
  currency: string;
  showProductPrices: boolean;
  cities: FormOption[];
  considering: FormOption[];
  budgets: BudgetOption[];
  rooms: FormOption[];
};

const SiteConfigContext = createContext<SiteConfigValue>({
  currency: DEFAULT_SETTINGS.currency,
  showProductPrices: DEFAULT_SETTINGS.show_product_prices,
  cities: DEFAULT_SETTINGS.form_cities,
  considering: DEFAULT_SETTINGS.form_considering,
  budgets: DEFAULT_SETTINGS.form_budgets,
  rooms: DEFAULT_SETTINGS.form_rooms,
});

export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfigValue;
  children: ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
