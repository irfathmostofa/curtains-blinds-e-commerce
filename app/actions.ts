"use server";

import { cookies } from "next/headers";
import { bookingSchema, estimateSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/data/store";
import type { Booking, Lead } from "@/lib/types";

const rateKey = "form_submits";

function rateLimited() {
  const jar = cookies();
  const raw = jar.get(rateKey)?.value;
  const count = raw ? Number(raw) : 0;
  if (count > 8) return true;
  jar.set(rateKey, String(count + 1), { maxAge: 60 * 30, path: "/" });
  return false;
}

export async function submitEstimate(input: unknown) {
  const parsed = estimateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid form" };
  if (parsed.data.company) return { ok: true };
  if (rateLimited()) return { ok: false, error: "Please wait before submitting again." };

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    product_interest: parsed.data.productType,
    budget_range: parsed.data.budget,
    message: `Rooms: ${parsed.data.rooms}. ${parsed.data.message || ""}`.trim(),
    source: "get-estimate",
    status: "new",
  };

  const supabase = createClient();
  if (supabase) {
    const { error } = await supabase.from("leads").insert(payload);
    if (error) return { ok: false, error: error.message };
  } else {
    getStore().leads.unshift({
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    } as Lead);
  }

  cookies().set("estimate_draft", "", { maxAge: 0, path: "/" });
  return { ok: true };
}

export async function submitBooking(input: unknown) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid form" };
  if (parsed.data.company) return { ok: true };
  if (rateLimited()) return { ok: false, error: "Please wait before submitting again." };

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    location: parsed.data.location,
    address: parsed.data.address,
    preferred_date: parsed.data.preferredDate,
    preferred_time_slot: parsed.data.preferredTime,
    status: "new",
  };

  const supabase = createClient();
  if (supabase) {
    const { error } = await supabase.from("bookings").insert(payload);
    if (error) return { ok: false, error: error.message };
  } else {
    getStore().bookings.unshift({
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    } as Booking);
  }

  cookies().set("estimate_draft", "", { maxAge: 0, path: "/" });
  return { ok: true };
}

export async function saveDraft(data: Record<string, string>) {
  cookies().set("estimate_draft", JSON.stringify(data), {
    maxAge: 60 * 60 * 6,
    path: "/",
  });
}

export async function rememberProduct(slug: string) {
  const jar = cookies();
  let slugs: string[] = [];
  try {
    slugs = JSON.parse(jar.get("recently_viewed_products")?.value || "[]");
  } catch {
    slugs = [];
  }
  const next = [slug, ...slugs.filter((s) => s !== slug)].slice(0, 10);
  jar.set("recently_viewed_products", JSON.stringify(next), {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}
