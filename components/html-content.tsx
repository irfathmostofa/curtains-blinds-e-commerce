import { looksLikeHtml, normalizeRichText } from "@/lib/html";
import { cn } from "@/lib/utils";

export function HtmlContent({ html, className }: { html: string; className?: string }) {
  const safe = normalizeRichText(html);
  if (!safe) return null;
  if (!looksLikeHtml(safe)) {
    return <div className={cn("leading-relaxed text-muted-foreground", className)}>{safe}</div>;
  }
  return (
    <div
      className={cn("prose prose-stone max-w-none text-muted-foreground", className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
