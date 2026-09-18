"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { EntityConfig, FieldConfig } from "@/lib/admin/entities";
import { deleteEntity, upsertEntity } from "@/app/admin/actions";

function FieldControl({
  field,
  values,
  setField,
}: {
  field: FieldConfig;
  values: Record<string, unknown>;
  setField: (name: string, value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <Textarea
        id={field.name}
        required={field.required}
        value={String(values[field.name] ?? "")}
        onChange={(e) => setField(field.name, e.target.value)}
      />
    );
  }
  if (field.type === "checkbox") {
    return (
      <input
        id={field.name}
        type="checkbox"
        checked={Boolean(values[field.name])}
        onChange={(e) => setField(field.name, e.target.checked)}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        id={field.name}
        className="h-11 w-full rounded-xl border bg-card px-3"
        value={String(values[field.name] ?? "")}
        onChange={(e) => setField(field.name, e.target.value)}
      >
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "json") {
    return (
      <Textarea
        id={field.name}
        value={
          typeof values[field.name] === "string"
            ? String(values[field.name])
            : Array.isArray(values[field.name])
              ? (values[field.name] as string[]).join(", ")
              : JSON.stringify(values[field.name] ?? [], null, 2)
        }
        onChange={(e) => setField(field.name, e.target.value)}
      />
    );
  }
  return (
    <Input
      id={field.name}
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      required={field.required}
      value={String(values[field.name] ?? "")}
      onChange={(e) => setField(field.name, e.target.value)}
    />
  );
}

export function FormBuilder({
  config,
  initial,
  onDone,
}: {
  config: EntityConfig;
  initial?: Record<string, unknown>;
  onDone?: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial || {});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<{ url: string; alt: string; thumbnailUrl?: string }[]>(() => {
    if (Array.isArray(initial?.images)) return initial?.images as { url: string; alt: string }[];
    if (initial?.cover_image_url) {
      return [{ url: String(initial.cover_image_url), alt: String(initial.cover_image_alt || "") }];
    }
    if (initial?.image_url) {
      return [{ url: String(initial.image_url), alt: String(initial.image_alt || "") }];
    }
    if (initial?.logo_url) {
      return [{ url: String(initial.logo_url), alt: String(initial.logo_alt || "") }];
    }
    return [];
  });

  function setField(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  const contentFields = config.fields.filter((f) => (f.group || "content") === "content");
  const seoFields = config.fields.filter((f) => f.group === "seo");
  const showMedia = ["products", "categories", "posts", "partners"].includes(config.key);
  const seoTitle = String(values.seo_title || values.name || values.title || "");
  const seoDesc = String(values.seo_description || values.description || values.excerpt || "");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = { ...values };
    if (payload.base_price) payload.base_price = Number(payload.base_price);
    if (payload.sort_order) payload.sort_order = Number(payload.sort_order);
    if (payload.rating) payload.rating = Number(payload.rating);
    if (typeof payload.fabric_options === "string") {
      try {
        payload.fabric_options = payload.fabric_options.trim().startsWith("[")
          ? JSON.parse(payload.fabric_options)
          : payload.fabric_options.split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        payload.fabric_options = String(payload.fabric_options)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (config.key === "products") payload.images = images;
    if (config.key === "categories" && images[0]) {
      payload.image_url = images[0].url;
      payload.image_alt = images[0].alt;
    }
    if (config.key === "posts" && images[0]) {
      payload.cover_image_url = images[0].url;
      payload.cover_image_alt = images[0].alt;
    }
    if (config.key === "partners" && images[0]) {
      payload.logo_url = images[0].url;
      payload.logo_alt = images[0].alt;
    }
    const result = await upsertEntity(config.storeKey, payload);
    setSaving(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        {contentFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <FieldControl field={field} values={values} setField={setField} />
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
          </div>
        ))}
      </section>

      {showMedia ? (
        <section className="space-y-3 rounded-2xl border p-4">
          <h3 className="font-serif text-lg">Images</h3>
          <ImageUploader
            folder={config.key === "posts" ? "blog-images" : config.key === "partners" ? "partner-logos" : "product-images"}
            suggestedAlt={`${String(values.name || values.title || "Maison Drape")} ${config.title.toLowerCase()}`}
            nameHint={String(values.slug || values.name || "image")}
            multiple={config.key === "products"}
            onUploaded={(asset) => setImages((imgs) => (config.key === "products" ? [...imgs, asset] : [asset]))}
          />
          <ul className="grid gap-3 sm:grid-cols-3">
            {images.map((img, i) => (
              <li key={`${img.url}-${i}`} className="overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.thumbnailUrl || img.url} alt={img.alt} className="h-24 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2 text-xs">
                  <span className="truncate">{img.alt}</span>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {seoFields.length ? (
        <section className="space-y-4 rounded-2xl border p-4">
          <div>
            <h3 className="font-serif text-lg">SEO metadata</h3>
            <p className="text-xs text-muted-foreground">Controls title, description, Open Graph and search snippets.</p>
          </div>
          {seoFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <FieldControl field={field} values={values} setField={setField} />
              {field.name === "seo_title" ? (
                <p className="text-xs text-muted-foreground">{seoTitle.length}/60 characters</p>
              ) : null}
              {field.name === "seo_description" ? (
                <p className="text-xs text-muted-foreground">{seoDesc.length}/160 characters</p>
              ) : null}
              {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            </div>
          ))}
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Google preview</p>
            <p className="mt-1 truncate text-sm text-blue-800">{seoTitle || "Meta title"}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{seoDesc || "Meta description"}</p>
          </div>
        </section>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        {initial?.id ? (
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              await deleteEntity(config.storeKey, String(initial.id));
              onDone?.();
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
