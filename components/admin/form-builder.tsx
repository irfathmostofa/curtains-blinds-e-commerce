"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { EntityConfig } from "@/lib/admin/entities";
import { deleteEntity, upsertEntity } from "@/app/admin/actions";

export function FormBuilder({
  config,
  initial,
}: {
  config: EntityConfig;
  initial?: Record<string, unknown>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial || {});
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    Array.isArray(initial?.images) ? (initial?.images as { url: string; alt: string }[]) : []
  );

  function setField(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...values, images: images.length ? images : values.images };
    if (payload.base_price) payload.base_price = Number(payload.base_price);
    if (payload.sort_order) payload.sort_order = Number(payload.sort_order);
    if (payload.rating) payload.rating = Number(payload.rating);
    if (typeof payload.fabric_options === "string") {
      try {
        payload.fabric_options = JSON.parse(payload.fabric_options as string);
      } catch {
        payload.fabric_options = String(payload.fabric_options)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    const result = await upsertEntity(config.storeKey, payload);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    router.push(config.href);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              required={field.required}
              defaultValue={String(values[field.name] ?? "")}
              onChange={(e) => setField(field.name, e.target.value)}
            />
          ) : field.type === "checkbox" ? (
            <input
              id={field.name}
              type="checkbox"
              defaultChecked={Boolean(values[field.name])}
              onChange={(e) => setField(field.name, e.target.checked)}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              className="h-11 w-full rounded-xl border bg-card px-3"
              defaultValue={String(values[field.name] ?? "")}
              onChange={(e) => setField(field.name, e.target.value)}
            >
              {field.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : field.type === "json" ? (
            <Textarea
              id={field.name}
              defaultValue={
                typeof values[field.name] === "string"
                  ? String(values[field.name])
                  : JSON.stringify(values[field.name] ?? [], null, 2)
              }
              onChange={(e) => setField(field.name, e.target.value)}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              required={field.required}
              defaultValue={String(values[field.name] ?? "")}
              onChange={(e) => setField(field.name, e.target.value)}
            />
          )}
          {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
        </div>
      ))}

      {config.key === "products" || config.key === "categories" || config.key === "posts" || config.key === "partners" ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Images</p>
          <ImageUploader
            suggestedAlt={`${String(values.name || values.title || "Maison Drape")} product image`}
            nameHint={String(values.slug || values.name || "image")}
            onUploaded={(asset) => setImages((imgs) => [...imgs, asset])}
          />
          <ul className="grid gap-2 sm:grid-cols-3">
            {images.map((img) => (
              <li key={img.url} className="truncate rounded-xl border p-2 text-xs">
                {img.alt}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit">Save</Button>
        {initial?.id ? (
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              await deleteEntity(config.storeKey, String(initial.id));
              router.push(config.href);
              router.refresh();
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
