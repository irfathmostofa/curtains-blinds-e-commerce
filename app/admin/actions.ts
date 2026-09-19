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

  const email = process.env.DEMO_ADMIN_EMAIL || "admin@maisondrape.ae";
  const password = process.env.DEMO_ADMIN_PASSWORD || "admin123";
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
  const store = getStore();
  const id = String(payload.id || crypto.randomUUID());
  const row: Record<string, unknown> = { ...payload, id };
  if (!row.slug && (row.name || row.title)) {
    row.slug = slugify(String(row.name || row.title));
  }

  const list = (store as Record<string, unknown>)[entity];
  if (!Array.isArray(list)) return { error: "Unknown entity" };

  const idx = list.findIndex((item: { id?: string }) => item.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], ...row };
  else list.unshift(row);

  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    if (supabase) {
      const { error } = await supabase.from(mapTable(entity)).upsert(row);
      if (error) return { error: error.message };
    }
  }
  return { ok: true, id };
}

export async function deleteEntity(entity: string, id: string) {
  const store = getStore();
  const list = (store as Record<string, unknown>)[entity];
  if (Array.isArray(list)) {
    const idx = list.findIndex((item: { id?: string }) => item.id === id);
    if (idx >= 0) list.splice(idx, 1);
  }
  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    await supabase?.from(mapTable(entity)).delete().eq("id", id);
  }
  return { ok: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const store = getStore();
  const lead = store.leads.find((l) => l.id === id);
  if (lead) lead.status = status as typeof lead.status;
  if (isSupabaseConfigured()) {
    await createClient()?.from("leads").update({ status }).eq("id", id);
  }
  return { ok: true };
}

export async function updateBookingStatus(id: string, status: string) {
  const store = getStore();
  const row = store.bookings.find((l) => l.id === id);
  if (row) row.status = status as typeof row.status;
  if (isSupabaseConfigured()) {
    await createClient()?.from("bookings").update({ status }).eq("id", id);
  }
  return { ok: true };
}

export async function saveSettings(settings: Record<string, unknown>) {
  const store = getStore();
  store.settings = { ...store.settings, ...settings } as typeof store.settings;
  if (isSupabaseConfigured()) {
    const supabase = createWriteClient();
    await supabase?.from("site_settings").upsert([
      { key: "general", value: settings },
      { key: "seo", value: (settings as { seo?: unknown }).seo || store.settings.seo },
      { key: "homepage", value: (settings as { homepage?: unknown }).homepage || store.settings.homepage },
    ]);
  }
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
  const buckets = ["product-images", "blog-images", "partner-logos"];
  return buckets.includes(folder) ? folder : "product-images";
}

function mapTable(entity: string) {
  const map: Record<string, string> = {
    products: "products",
    categories: "categories",
    leads: "leads",
    bookings: "bookings",
    testimonials: "testimonials",
    posts: "blog_posts",
    faqs: "faqs",
    partners: "partners",
    pages: "cms_pages",
    users: "admin_users",
  };
  return map[entity] || entity;
}
