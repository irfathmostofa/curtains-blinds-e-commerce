"use client";

import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

export function SlugField({
  value,
  source,
  locked,
  onChange,
  onLock,
}: {
  value: string;
  source: string;
  locked: boolean;
  onChange: (next: string) => void;
  onLock: (locked: boolean) => void;
}) {
  const generated = slugify(source);

  return (
    <div className="space-y-2">
      <Input
        id="slug"
        value={value}
        onChange={(e) => {
          onLock(true);
          onChange(slugify(e.target.value) || e.target.value);
        }}
        placeholder={generated || "auto-generated-from-name"}
      />
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>{locked ? "Custom slug" : "Updates automatically from the name"}</span>
        {locked ? (
          <button
            type="button"
            className="underline"
            onClick={() => {
              onLock(false);
              onChange(generated);
            }}
          >
            Reset to auto
          </button>
        ) : null}
      </div>
    </div>
  );
}
