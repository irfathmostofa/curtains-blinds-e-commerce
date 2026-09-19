"use client";

import { useEffect, useRef } from "react";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { sanitizeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

function command(name: string, value?: string) {
  document.execCommand(name, false, value);
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write a description…",
  minHeight = "180px",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value !== last.current) {
      el.innerHTML = value || "";
      last.current = value;
    }
  }, [value]);

  function emit() {
    const html = sanitizeHtml(ref.current?.innerHTML || "");
    last.current = html;
    onChange(html);
  }

  function wrapLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    command("createLink", url);
    emit();
  }

  const tools: { label: string; icon: typeof Bold; run: () => void }[] = [
    { label: "Bold", icon: Bold, run: () => command("bold") },
    { label: "Italic", icon: Italic, run: () => command("italic") },
    { label: "Heading", icon: Heading2, run: () => command("formatBlock", "h2") },
    { label: "Subheading", icon: Heading3, run: () => command("formatBlock", "h3") },
    { label: "Bullets", icon: List, run: () => command("insertUnorderedList") },
    { label: "Numbers", icon: ListOrdered, run: () => command("insertOrderedList") },
    { label: "Quote", icon: Quote, run: () => command("formatBlock", "blockquote") },
    { label: "Link", icon: Link2, run: wrapLink },
    { label: "Undo", icon: Undo2, run: () => command("undo") },
    { label: "Redo", icon: Redo2, run: () => command("redo") },
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap gap-1 border-b bg-secondary/60 p-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
            aria-label={tool.label}
            onMouseDown={(e) => {
              e.preventDefault();
              tool.run();
              ref.current?.focus();
              emit();
            }}
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "prose prose-stone max-w-none px-4 py-3 text-sm outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
