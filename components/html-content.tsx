import { cn } from "@/lib/utils";
import { looksLikeHtml } from "@/lib/html";

export function HtmlContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  if (!looksLikeHtml(html)) {
    return <div className={cn("leading-relaxed text-muted-foreground", className)}>{html}</div>;
  }
  return (
    <div
      className={cn("prose prose-stone max-w-none text-muted-foreground", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
