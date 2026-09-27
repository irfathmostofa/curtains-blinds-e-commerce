"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTED_FABRICS = [
  "Natural flax",
  "Ivory",
  "Sand",
  "Stone grey",
  "Charcoal",
  "Navy",
  "White",
  "Beige",
  "Blackout",
  "Sunscreen 5%",
];

export function TagInput({
  value,
  onChange,
  placeholder = "Add an option and press Enter",
  suggestions = SUGGESTED_FABRICS,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const next = raw.trim();
    if (!next || value.includes(next)) {
      setDraft("");
      return;
    }
    onChange([...value, next]);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    }
    if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  const unused = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 hover:bg-card"
              onClick={() => onChange(value.filter((item) => item !== tag))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {!value.length ? <p className="text-sm text-muted-foreground">No fabrics yet. Add one below.</p> : null}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft.trim() && add(draft)}
        />
        <Button type="button" variant="outline" onClick={() => add(draft)} className="sm:w-auto">
          Add
        </Button>
      </div>
      {unused.length ? (
        <div className="flex flex-wrap gap-2">
          {unused.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
              onClick={() => add(suggestion)}
            >
              + {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
