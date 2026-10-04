"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

import type { EntityConfig, FieldConfig } from "@/lib/admin/entities";
import { deleteEntity, upsertEntity } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import { TagInput } from "./tag-input";
import { normalizeRichText, stripHtml } from "@/lib/html";
import { SlugField } from "./slug-field";

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return raw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function FieldControl({
  field,
  values,
  setField,
  slugLocked,
  setSlugLocked,
  options,
}: {
  field: FieldConfig;
  values: Record<string, unknown>;
  setField: (name: string, value: unknown) => void;
  slugLocked: boolean;
  setSlugLocked: (locked: boolean) => void;
  options: { label: string; value: string }[];
}) {
  if (field.type === "richtext") {
    return (
      <RichTextEditor
        value={String(values[field.name] ?? "")}
        onChange={(html) => setField(field.name, html)}
        placeholder={`Write ${field.label.toLowerCase()}…`}
        minHeight={field.name === "content" ? "280px" : "180px"}
      />
    );
  }
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
      <label className="flex min-h-11 items-center gap-3 rounded-xl border bg-card px-3">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(values[field.name])}
          onChange={(e) => setField(field.name, e.target.checked)}
        />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }
  if (field.type === "select") {
    return (
      <select
        id={field.name}
        required={field.required}
        className="h-11 w-full rounded-xl border bg-card px-3"
        value={String(values[field.name] ?? "")}
        onChange={(e) => setField(field.name, e.target.value)}
      >
        <option value="">{field.required ? "Select…" : "None"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "tags") {
    return <TagInput value={asTags(values[field.name])} onChange={(next) => setField(field.name, next)} />;
  }
  if (field.type === "slug") {
    const source = String(values.name || values.title || "");
    return (
      <SlugField
        value={String(values.slug ?? "")}
        source={source}
        locked={slugLocked}
        onChange={(next) => setField("slug", next)}
        onLock={setSlugLocked}
      />
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
  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "email"
          ? "email"
          : field.type === "tel"
            ? "tel"
            : "text";
  const raw = String(values[field.name] ?? "");
  const value = field.type === "date" && raw ? raw.slice(0, 10) : raw;
  return (
    <Input
      id={field.name}
      type={inputType}
      required={field.required}
      min={field.name === "rating" ? 1 : undefined}
      max={field.name === "rating" ? 5 : undefined}
      step={field.type === "number" ? "any" : undefined}
      readOnly={field.name === "id" && Boolean(values.id)}
      value={value}
      onChange={(e) => setField(field.name, e.target.value)}
    />
  );
}

export function FormBuilder({
  config,
  initial,
  onDone,
  categories = [],
}: {
  config: EntityConfig;
  initial?: Record<string, unknown>;
  onDone?: () => void;
  categories?: { id: string; name: string }[];
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    if (initial) {
      const next = { ...initial };
      if ("content" in next) next.content = normalizeRichText(next.content);
      if ("description" in next) next.description = normalizeRichText(next.description);
      if ("answer" in next) next.answer = normalizeRichText(next.answer);
      return next;
    }
    if (config.key === "products") return { is_active: true, fabric_options: [] };
    if (config.key === "posts") return { author: "Maison Drape Studio", content: "" };
    return {};
  });
  const [slugLocked, setSlugLocked] = useState(Boolean(initial?.slug));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [variants, setVariants] = useState<{ id?: string; size_label: string; price: string; sku: string }[]>(() => {
    if (!Array.isArray(initial?.variants)) return [];
    return (initial.variants as { id?: string; size_label?: string; price?: number; sku?: string }[]).map((v) => ({
      id: v.id,
      size_label: String(v.size_label || ""),
      price: String(v.price ?? ""),
      sku: String(v.sku || ""),
    }));
  });
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
    setValues((v) => {
      const next = { ...v, [name]: value };
      if ((name === "name" || name === "title") && !slugLocked) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  const contentFields = config.fields.filter((f) => (f.group || "content") === "content");
  const mediaFields = config.fields.filter((f) => f.group === "media");
  const seoFields = config.fields.filter((f) => f.group === "seo");
  const showMedia = ["products", "categories", "posts", "partners"].includes(config.key);
  const seoTitle = String(values.seo_title || values.name || values.title || "");
  const seoDesc = stripHtml(String(values.seo_description || values.description || values.excerpt || ""));

  function fieldOptions(field: FieldConfig) {
    if (field.options?.length) return field.options;
    if (field.name === "category_id") {
      return categories
        .filter((c) => /^[0-9a-f-]{36}$/i.test(c.id))
        .map((c) => ({ label: c.name, value: c.id }));
    }
    if (field.name === "parent_id") {
      return categories
        .filter((c) => c.id !== values.id && /^[0-9a-f-]{36}$/i.test(c.id))
        .map((c) => ({ label: c.name, value: c.id }));
    }
    return [];
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    for (const field of config.fields) {
      if (!field.required || field.type === "checkbox") continue;
      if (
        (field.name === "cover_image_alt" || field.name === "image_alt" || field.name === "logo_alt") &&
        (images[0]?.alt || images[0]?.url)
      ) {
        continue;
      }
      const val = field.type === "richtext" ? normalizeRichText(values[field.name]) : values[field.name];
      if (val === undefined || val === null || String(val).trim() === "" || (field.type === "richtext" && !stripHtml(String(val)))) {
        setError(`${field.label} is required.`);
        return;
      }
    }
    setSaving(true);
    const payload: Record<string, unknown> = { ...values };
    for (const field of config.fields) {
      if (field.type === "richtext") payload[field.name] = normalizeRichText(payload[field.name]);
    }
    if (!payload.slug) payload.slug = slugify(String(payload.name || payload.title || ""));
    if (payload.parent_id === "") payload.parent_id = null;
    if (payload.category_id === "") payload.category_id = null;
    payload.fabric_options = asTags(payload.fabric_options);
    if (config.key === "products") {
      payload.images = images;
      payload.variants = variants.filter((v) => v.size_label.trim());
    }
    if (config.key === "categories" && images[0]) {
      payload.image_url = images[0].url;
      payload.image_alt = images[0].alt || payload.image_alt;
    }
    if (config.key === "posts") {
      if (images[0]) {
        payload.cover_image_url = images[0].url;
        payload.cover_image_alt = images[0].alt || payload.cover_image_alt || "";
      } else {
        payload.cover_image_url = "";
        payload.cover_image_alt = payload.cover_image_alt || "";
      }
    }
    if (config.key === "partners" && images[0]) {
      payload.logo_url = images[0].url;
      payload.logo_alt = images[0].alt || payload.logo_alt;
    }
    if (config.idField === "slug") delete payload.id;
    const result = await upsertEntity(config.key, payload);
    setSaving(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:px-6">
      <section className="grid gap-4 sm:grid-cols-2">
        {contentFields.map((field) => (
          <div
            key={field.name}
            className={
              field.type === "richtext" || field.type === "textarea" || field.type === "tags" || field.type === "slug"
                ? "space-y-2 sm:col-span-2"
                : field.type === "checkbox"
                  ? "space-y-2 sm:col-span-1"
                  : "space-y-2"
            }
          >
            {field.type === "checkbox" ? null : <Label htmlFor={field.name}>{field.label}</Label>}
            <FieldControl
              field={field}
              values={values}
              setField={setField}
              slugLocked={slugLocked}
              setSlugLocked={setSlugLocked}
              options={fieldOptions(field)}
            />
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
          </div>
        ))}
      </section>

      {config.key === "products" ? (
        <section className="space-y-3 rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-lg">Variants</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setVariants((rows) => [...rows, { size_label: "", price: "", sku: "" }])}
            >
              Add size
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Optional SKUs stored in product_variants.</p>
          {variants.length ? (
            <div className="grid gap-3">
              {variants.map((row, i) => (
                <div key={row.id || i} className="grid gap-2 sm:grid-cols-[1.4fr_0.8fr_1fr_auto]">
                  <Input
                    placeholder="Size label"
                    value={row.size_label}
                    onChange={(e) =>
                      setVariants((rows) => rows.map((item, idx) => (idx === i ? { ...item, size_label: e.target.value } : item)))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) =>
                      setVariants((rows) => rows.map((item, idx) => (idx === i ? { ...item, price: e.target.value } : item)))
                    }
                  />
                  <Input
                    placeholder="SKU"
                    value={row.sku}
                    onChange={(e) =>
                      setVariants((rows) => rows.map((item, idx) => (idx === i ? { ...item, sku: e.target.value } : item)))
                    }
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setVariants((rows) => rows.filter((_, idx) => idx !== i))}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No variants yet. Base price still shows on the product card.</p>
          )}
        </section>
      ) : null}

      {showMedia ? (
        <section className="space-y-3 rounded-2xl border p-4">
          <h3 className="font-serif text-lg">Images</h3>
          {mediaFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <FieldControl
                field={field}
                values={values}
                setField={setField}
                slugLocked={slugLocked}
                setSlugLocked={setSlugLocked}
                options={fieldOptions(field)}
              />
              {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            </div>
          ))}
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
              <FieldControl
                field={field}
                values={values}
                setField={setField}
                slugLocked={slugLocked}
                setSlugLocked={setSlugLocked}
                options={field.options || []}
              />
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

      {Array.isArray(values.transcript) && values.transcript.length ? (
        <section className="space-y-3 rounded-2xl border p-4">
          <h3 className="font-serif text-lg">Chat transcript</h3>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {(values.transcript as { role?: string; text?: string }[]).map((line, i) => (
              <li
                key={i}
                className={
                  line.role === "user"
                    ? "ml-8 rounded-xl bg-primary px-3 py-2 text-primary-foreground"
                    : "mr-8 rounded-xl bg-secondary px-3 py-2"
                }
              >
                <span className="mb-1 block text-[0.65rem] uppercase tracking-wider opacity-70">{line.role}</span>
                {line.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      </div>
      <div className="flex shrink-0 flex-col gap-2 border-t bg-card px-4 py-3 sm:px-6">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="submit" disabled={saving} className="min-w-28 w-full sm:w-auto">
            {saving ? "Saving…" : "Save"}
          </Button>
          {initial && (initial.id || initial.slug) ? (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={async () => {
                const id = String(config.idField === "slug" ? initial.slug : initial.id);
                const result = await deleteEntity(config.key, id);
                if ("error" in result && result.error) {
                  setError(result.error);
                  return;
                }
                onDone?.();
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
