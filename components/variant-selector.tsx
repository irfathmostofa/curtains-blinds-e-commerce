"use client";

import { cn } from "@/lib/utils";

export type VariantOption = { id: string; label: string };

export function VariantSelector({
  variants,
  value,
  onSelect,
  label = "Options",
}: {
  variants: VariantOption[];
  value?: string;
  onSelect: (id: string) => void;
  label?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              value === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"
            )}
            aria-pressed={value === v.id}
          >
            {v.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
