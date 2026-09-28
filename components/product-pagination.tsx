"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

function hrefFor(pathname: string, params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params.toString());
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function ProductPagination({
  page,
  pageCount,
  total,
  pageSize,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
}) {
  const { t, dir } = useLocale();
  const pathname = usePathname();
  const params = useSearchParams();
  if (pageCount <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-4 sm:flex-row" aria-label={t("Pagination")}>
      <p className="text-sm text-muted-foreground">
        {t("Showing")} {start}–{end} {t("of")} {total}
      </p>
      <div className="flex items-center gap-1">
        <PageLink
          href={hrefFor(pathname, params, page - 1)}
          disabled={page <= 1}
          label={t("Previous")}
        >
          <PrevIcon className="h-4 w-4" />
        </PageLink>
        {pages.map((n) => (
          <PageLink key={n} href={hrefFor(pathname, params, n)} active={n === page} label={`${t("Page")} ${n}`}>
            {n}
          </PageLink>
        ))}
        <PageLink
          href={hrefFor(pathname, params, page + 1)}
          disabled={page >= pageCount}
          label={t("Next")}
        >
          <NextIcon className="h-4 w-4" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  label,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/40" aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm transition",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
      )}
    >
      {children}
    </Link>
  );
}
