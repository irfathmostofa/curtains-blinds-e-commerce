import { entityAllowedColumns } from "@/lib/admin/entities";
import { slugify } from "@/lib/utils";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown) {
  return typeof value === "string" && UUID_RE.test(value);
}

function asNumber(value: unknown, fallback = 0) {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown) {
  return value === true || value === "true" || value === "on" || value === 1 || value === "1";
}

function asString(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asNullableString(value: unknown) {
  const s = asString(value).trim();
  return s ? s : null;
}

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
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

function asImages(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { url?: string; alt?: string; thumbnailUrl?: string };
      if (!row.url) return null;
      return {
        url: String(row.url),
        alt: String(row.alt || ""),
        thumbnailUrl: row.thumbnailUrl ? String(row.thumbnailUrl) : undefined,
      };
    })
    .filter(Boolean);
}

function asDate(value: unknown) {
  const s = asString(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function asTimestamp(value: unknown) {
  const s = asString(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00.000Z`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function sanitizeEntityPayload(entity: string, payload: Record<string, unknown>) {
  const allowed = entityAllowedColumns(entity);
  const raw: Record<string, unknown> = { ...payload };
  delete raw.category;
  delete raw.variants;
  delete raw.created_at;

  if (!raw.slug && (raw.name || raw.title)) {
    raw.slug = slugify(String(raw.name || raw.title));
  }

  if (entity === "products") {
    const categoryId = asNullableString(raw.category_id);
    raw.category_id = categoryId && isUuid(categoryId) ? categoryId : null;
    raw.base_price = asNumber(raw.base_price, 0);
    raw.is_bestseller = asBool(raw.is_bestseller);
    raw.is_active = raw.is_active === undefined ? true : asBool(raw.is_active);
    raw.fabric_options = asTags(raw.fabric_options);
    raw.images = asImages(raw.images);
    raw.description = asString(raw.description);
    raw.seo_title = asString(raw.seo_title);
    raw.seo_description = asString(raw.seo_description);
    raw.seo_keywords = asString(raw.seo_keywords);
  }

  if (entity === "categories") {
    const parentId = asNullableString(raw.parent_id);
    raw.parent_id = parentId && isUuid(parentId) ? parentId : null;
    raw.sort_order = asNumber(raw.sort_order, 0);
    raw.description = asString(raw.description);
    raw.image_url = asString(raw.image_url);
    raw.image_alt = asString(raw.image_alt);
    raw.seo_title = asString(raw.seo_title);
    raw.seo_description = asString(raw.seo_description);
    raw.seo_keywords = asString(raw.seo_keywords);
  }

  if (entity === "leads") {
    raw.product_interest = asString(raw.product_interest);
    raw.budget_range = asString(raw.budget_range);
    raw.message = asString(raw.message);
    raw.source = asString(raw.source, "website");
    raw.status = asString(raw.status, "new") || "new";
  }

  if (entity === "chatLeads") {
    raw.estimate_min = asNumber(raw.estimate_min, 0);
    raw.estimate_max = asNumber(raw.estimate_max, 0);
    raw.booking_date = asDate(raw.booking_date) || "";
    raw.booking_time = asString(raw.booking_time);
    raw.source = asString(raw.source, "ai-chatbot");
    raw.status = asString(raw.status, "new") || "new";
    raw.transcript = Array.isArray(raw.transcript) ? raw.transcript : [];
  }

  if (entity === "bookings") {
    raw.notes = asString(raw.notes);
    raw.status = asString(raw.status, "new") || "new";
    raw.preferred_date = asDate(raw.preferred_date);
  }

  if (entity === "testimonials") {
    const rating = asNumber(raw.rating, 5);
    raw.rating = Math.min(5, Math.max(1, rating || 5));
    raw.source = asString(raw.source, "Google");
    raw.is_featured = asBool(raw.is_featured);
    raw.review_text = asString(raw.review_text);
  }

  if (entity === "posts") {
    raw.excerpt = asString(raw.excerpt);
    raw.content = asString(raw.content);
    raw.cover_image_url = asString(raw.cover_image_url);
    raw.cover_image_alt = asString(raw.cover_image_alt);
    raw.author = asString(raw.author, "Maison Drape Studio");
    raw.published_at = asTimestamp(raw.published_at);
    raw.seo_title = asString(raw.seo_title);
    raw.seo_description = asString(raw.seo_description);
    raw.seo_keywords = asString(raw.seo_keywords);
  }

  if (entity === "faqs") {
    raw.category = asString(raw.category, "general") || "general";
    raw.sort_order = asNumber(raw.sort_order, 0);
    raw.answer = asString(raw.answer);
  }

  if (entity === "partners") {
    raw.logo_url = asString(raw.logo_url);
    raw.logo_alt = asString(raw.logo_alt);
    raw.sort_order = asNumber(raw.sort_order, 0);
  }

  if (entity === "pages") {
    raw.content = asString(raw.content);
    raw.seo_title = asString(raw.seo_title);
    raw.seo_description = asString(raw.seo_description);
  }

  if (entity === "users") {
    raw.role = asString(raw.role, "editor") === "admin" ? "admin" : "editor";
    raw.email = asString(raw.email).trim().toLowerCase();
  }

  const next: Record<string, unknown> = {};
  for (const key of allowed) {
    if (raw[key] !== undefined) next[key] = raw[key];
  }
  return next;
}

export function sanitizeVariants(productId: string, variants: unknown) {
  if (!Array.isArray(variants)) return [];
  return variants
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { id?: string; size_label?: string; price?: unknown; sku?: string };
      const size_label = asString(row.size_label).trim();
      if (!size_label) return null;
      return {
        id: isUuid(row.id) ? row.id : crypto.randomUUID(),
        product_id: productId,
        size_label,
        price: asNumber(row.price, 0),
        sku: asString(row.sku).trim() || slugify(`${size_label}-${productId}`).slice(0, 32).toUpperCase(),
      };
    })
    .filter(Boolean) as { id: string; product_id: string; size_label: string; price: number; sku: string }[];
}
