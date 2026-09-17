"use client";

import { Textarea } from "@/components/ui/textarea";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[240px] font-mono text-sm" />
      <p className="text-xs text-muted-foreground">HTML is stored and rendered on the public blog. Use semantic tags: p, h2, h3, ul.</p>
    </div>
  );
}
