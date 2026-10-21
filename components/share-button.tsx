"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function ShareButton({
  title,
  path,
  className,
}: {
  title: string;
  path?: string;
  className?: string;
}) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  async function share() {
    const href =
      path && typeof window !== "undefined"
        ? `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
        : typeof window !== "undefined"
          ? window.location.href
          : path || "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url: href, text: title });
        return;
      }
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void share()} className={cn("gap-2", className)}>
      <Share2 className="h-4 w-4" />
      {copied ? t("Link copied") : t("Share")}
    </Button>
  );
}
