"use client";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-full border border-border/80 bg-card/80 p-1 text-xs font-medium backdrop-blur",
        className
      )}
      role="group"
      aria-label={t("Switch language")}
    >
      <button
        type="button"
        className={cn(
          "h-8 min-w-10 rounded-full px-3 transition",
          locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={cn(
          "h-8 min-w-10 rounded-full px-3 transition",
          locale === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={locale === "ar"}
        onClick={() => setLocale("ar")}
      >
        ع
      </button>
    </div>
  );
}
