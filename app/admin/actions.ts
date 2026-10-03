"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, createWriteClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";
import { getStore } from "@/lib/data/store";
import { processImage } from "@/lib/images/process";
import { slugify } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { entities } from "@/lib/admin/entities";
import { isUuid, sanitizeEntityPayload, sanitizeVariants } from "@/lib/admin/payload";
import {
  SECRET_SETTING_KEYS,
  formatBusinessHoursSummary,
  normalizeBusinessHoursSchedule,
  normalizeLocations,
  normalizePaymentMethods,
} from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

const DEMO_COOKIE = "md_admin_session";

export async function adminLogin(_prev: { error: string }, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (!supabase) return { error: "Auth is not available." };
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: error.message };
    redirect("/admin");
  }

  const email = "admin@maisondrape.ae";
  const password = "admin123";
  if (parsed.data.email !== email || parsed.data.password !== password) {
    return { error: "Invalid credentials. Demo: admin@maisondrape.ae / admin123" };
  }
  cookies().set(DEMO_COOKIE, "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 12, sameSite: "lax" });
  redirect("/admin");
}

export async function adminLogout() {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase?.auth.signOut();
  }
  cookies().set(DEMO_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  redirect("/admin/login");
}

export async function upsertEntity(entity: string, payload: Record<string, unknown>) {
  const config = entities[entity];
  if (!config) return { error: "Unknown entity" };

  const store = getStore();
  const list = (store as Record<string, unknown>)[config.storeKey];
  if (!Array.isArray(list)) return { error: "Unknown entity" };

  const idField = config.idField || "id";
  const incomingId = payload.id ?? payload.slug;
  const needsUuid = idField === "id";
  let id = incomingId
    ? String(incomingId)
    : needsUuid
      ? crypto.randomUUID()
      : String(payload.slug || crypto.randomUUID());
  if (needsUuid && !isUuid(id) && isSupabaseConfigured()) {
    id = crypto.randomUUID();
  }

  const row = sanitizeEntityPayload(entity, {
    ...payload,
    ...(idField === "id" ? { id } : { slug: id }),
  });
  if (entity === "products" && !isUuid(row.category_id)) {
    return { error: "Choose a category from the list. Run supabase/migrations/20260929_seed_catalogue.sql if none appear." };
  }
  const variants = entity === "products" ? sanitizeVariants(String(row.id || id), payload.variants) : [];
  const lookupId = incomingId ? String(incomingId) : id;

  const idx = list.findIndex((item: { id?: string; slug?: string }) =>
    idField === "slug" ? item.slug === lookupId : item.id === lookupId
  );
  if (idx >= 0) list[idx] = { ...list[idx], ...row };
  else list.unshift(row);

  if (entity === "products") {
    store.variants = store.variants.filter((v) => v.product_id !== lookupId && v.product_id !== id).concat(variants);
  }

  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    if (supabase) {
      const { error } = await supabase.from(config.table).upsert(row);
      if (error) return { error: error.message };
      if (entity === "products") {
        await supabase.from("product_variants").delete().eq("product_id", id);
        if (variants.length) {
          const { error: variantError } = await supabase.from("product_variants").insert(variants);
          if (variantError) return { error: variantError.message };
        }
      }
    }
  }
  revalidateTag("catalog");
  if (entity === "posts") {
    revalidatePath("/blog");
    const slug = String(row.slug || "");
    if (slug) revalidatePath(`/blog/${slug}`);
  }
  return { ok: true, id };
}

export async function deleteEntity(entity: string, id: string) {
  const config = entities[entity];
  if (!config) return { error: "Unknown entity" };
  const store = getStore();
  const list = (store as Record<string, unknown>)[config.storeKey];
  const idField = config.idField || "id";
  if (Array.isArray(list)) {
    const idx = list.findIndex((item: { id?: string; slug?: string }) =>
      idField === "slug" ? item.slug === id : item.id === id
    );
    if (idx >= 0) list.splice(idx, 1);
  }
  if (entity === "products") {
    store.variants = store.variants.filter((v) => v.product_id !== id);
  }
  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    if (supabase) {
      const { error } = await supabase.from(config.table).delete().eq(idField, id);
      if (error) return { error: error.message };
    }
  }
  revalidateTag("catalog");
  if (entity === "posts") {
    revalidatePath("/blog");
    revalidatePath(`/blog/${id}`);
  }
  return { ok: true };
}

export async function updateLeadStatus(id: string, status: string) {
  return upsertEntity("leads", { id, status });
}

export async function updateBookingStatus(id: string, status: string) {
  return upsertEntity("bookings", { id, status });
}

export async function saveSettings(settings: Record<string, unknown>) {
  const store = getStore();
  store.settings = { ...store.settings, ...settings } as typeof store.settings;
  store.settings.payment_methods = normalizePaymentMethods(store.settings.payment_methods);
  store.settings.locations = normalizeLocations(store.settings.locations);
  store.settings.business_hours_schedule = normalizeBusinessHoursSchedule(store.settings.business_hours_schedule);
  store.settings.business_hours = formatBusinessHoursSummary(store.settings.business_hours_schedule);
  const next = store.settings;
  const general = {
    company_name: next.company_name,
    site_url: next.site_url,
    tagline: next.tagline,
    phone: next.phone,
    email: next.email,
    whatsapp: next.whatsapp,
    business_hours: next.business_hours,
    business_hours_schedule: next.business_hours_schedule,
    gtm_id: next.gtm_id,
    meta_pixel_id: next.meta_pixel_id,
    instagram_pixel_id: next.instagram_pixel_id,
    tiktok_pixel_id: next.tiktok_pixel_id,
    payment_methods: normalizePaymentMethods(next.payment_methods),
    under_construction: Boolean(next.under_construction),
  };
  const incomingHasSecrets = SECRET_SETTING_KEYS.some((key) => key in settings);
  const secrets = Object.fromEntries(SECRET_SETTING_KEYS.map((key) => [key, next[key] || ""])) as Pick<
    SiteSettings,
    (typeof SECRET_SETTING_KEYS)[number]
  >;
  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    if (!supabase) {
      revalidateTag("catalog");
      return { ok: true };
    }
    const rows: { key: string; value: unknown }[] = [
      { key: "general", value: general },
      { key: "nav_links", value: next.nav_links },
      { key: "locations", value: next.locations },
      { key: "social_links", value: next.social_links },
      { key: "trust", value: next.trust },
      { key: "seo", value: next.seo },
      { key: "homepage", value: next.homepage },
    ];
    if (incomingHasSecrets) rows.push({ key: "secrets", value: secrets });
    const { error } = await supabase.from("site_settings").upsert(rows);
    if (error) return { error: error.message };
  }
  revalidateTag("catalog");
  return { ok: true };
}

export async function uploadProcessedImage(formData: FormData) {
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "");
  const folder = String(formData.get("folder") || "product-images");
  const name = String(formData.get("name") || "image");
  if (!(file instanceof File) || !file.size) return { error: "Choose an image." };
  if (!alt.trim()) return { error: "Alt text is required." };

  const processed = await processImage(file, `${slugify(name)}-${Date.now()}`);
  const bucket = allowedBucket(folder);
  const admin = createAdminClient();

  if (admin) {
    await admin.storage.createBucket(bucket, { public: true }).catch(() => undefined);
    await admin.storage.updateBucket(bucket, { public: true }).catch(() => undefined);
    const { data, error } = await admin.storage
      .from(bucket)
      .upload(processed.fullName, processed.full, { contentType: "image/webp", upsert: true });
    if (!error && data) {
      await admin.storage.from(bucket).upload(processed.thumbName, processed.thumb, {
        contentType: "image/webp",
        upsert: true,
      });
      const pub = admin.storage.from(bucket).getPublicUrl(data.path);
      return {
        url: pub.data.publicUrl,
        alt,
        thumbnailUrl: admin.storage.from(bucket).getPublicUrl(processed.thumbName).data.publicUrl,
      };
    }
  }

  return saveLocalImage(processed, alt);
}

async function saveLocalImage(
  processed: { full: Buffer; thumb: Buffer; fullName: string; thumbName: string },
  alt: string
) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, processed.fullName), processed.full);
  await writeFile(path.join(dir, processed.thumbName), processed.thumb);
  return {
    url: `/uploads/${processed.fullName}`,
    thumbnailUrl: `/uploads/${processed.thumbName}`,
    alt,
  };
}

function allowedBucket(folder: string) {
  const buckets = ["product-images", "blog-images", "partner-logos", "payment-logos"];
  return buckets.includes(folder) ? folder : "product-images";
}
