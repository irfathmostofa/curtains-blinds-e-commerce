"use server";

import { cookies, headers } from "next/headers";
import { bookingSchema, chatLeadSchema, estimateSchema } from "@/lib/validations";
import { createWriteClient } from "@/lib/supabase/admin";
import { getStore } from "@/lib/data/store";
import type { Booking, ChatLead, Lead } from "@/lib/types";
import { trackServerEvent } from "@/lib/analytics/server";
import { newEventId } from "@/lib/analytics/events";
import { SITE_URL } from "@/lib/site";
import { notifyAdmin } from "@/lib/email";
import { getSiteSettings } from "@/lib/data/catalog";
import { isAdminLoggedIn } from "@/lib/admin/session";

function sourceUrl(path: string) {
  const host = headers().get("x-forwarded-host") || headers().get("host");
  const proto = headers().get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}${path}`;
  return `${SITE_URL}${path}`;
}

const rateKey = "form_submits";

async function publicSiteBlocked() {
  const settings = await getSiteSettings();
  if (!settings.under_construction) return false;
  return !(await isAdminLoggedIn());
}

function rateLimited() {
  const jar = cookies();
  const raw = jar.get(rateKey)?.value;
  const count = raw ? Number(raw) : 0;
  if (count > 8) return true;
  jar.set(rateKey, String(count + 1), { maxAge: 60 * 30, path: "/" });
  return false;
}

export async function submitEstimate(input: unknown) {
  if (await publicSiteBlocked()) return { ok: false, error: "The site is under construction." };
  const parsed = estimateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid form" };
  if (parsed.data.company) return { ok: true as const };
  if (rateLimited()) return { ok: false, error: "Please wait before submitting again." };

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || "",
    product_interest: parsed.data.productType,
    budget_range: parsed.data.budget,
    message: `Rooms: ${parsed.data.rooms}. ${parsed.data.message || ""}`.trim(),
    source: "get-estimate",
    status: "new",
  };

  const supabase = createWriteClient();
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
  await notifyAdmin({
    subject: `New estimate request from ${parsed.data.name}`,
    heading: "New estimate request",
    replyTo: parsed.data.email || undefined,
    rows: [
      { label: "Name", value: parsed.data.name },
      { label: "Phone", value: parsed.data.phone },
      { label: "Email", value: parsed.data.email || "" },
      { label: "Rooms", value: parsed.data.rooms },
      { label: "Product", value: parsed.data.productType },
      { label: "Budget", value: parsed.data.budget },
      { label: "Message", value: parsed.data.message || "" },
    ],
  });
  const eventId = newEventId();
  await trackServerEvent({
    name: "Lead",
    eventId,
    sourceUrl: sourceUrl("/get-estimate"),
    contentName: parsed.data.productType,
    contentType: "lead",
    user: { email: parsed.data.email, phone: parsed.data.phone, name: parsed.data.name },
    extra: { rooms: parsed.data.rooms, budget: parsed.data.budget, source: "get-estimate" },
  });
  return { ok: true, eventId };
}

export async function submitBooking(input: unknown) {
  if (await publicSiteBlocked()) return { ok: false, error: "The site is under construction." };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid form" };
  if (parsed.data.company) return { ok: true as const };
  if (rateLimited()) return { ok: false, error: "Please wait before submitting again." };

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || "",
    location: parsed.data.location,
    address: parsed.data.address,
    preferred_date: parsed.data.preferredDate,
    preferred_time_slot: parsed.data.preferredTime,
    notes: parsed.data.notes || "",
    status: "new",
  };

  const supabase = createWriteClient();
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
  await notifyAdmin({
    subject: `New booking from ${parsed.data.name}`,
    heading: "New measuring visit booking",
    replyTo: parsed.data.email || undefined,
    rows: [
      { label: "Name", value: parsed.data.name },
      { label: "Phone", value: parsed.data.phone },
      { label: "Email", value: parsed.data.email || "" },
      { label: "Location", value: parsed.data.location },
      { label: "Address", value: parsed.data.address },
      { label: "Preferred date", value: parsed.data.preferredDate },
      { label: "Time slot", value: parsed.data.preferredTime },
      { label: "Notes", value: parsed.data.notes || "" },
    ],
  });
  const eventId = newEventId();
  await trackServerEvent({
    name: "Schedule",
    eventId,
    sourceUrl: sourceUrl("/book"),
    contentName: "Free measuring visit",
    contentType: "booking",
    user: { email: parsed.data.email, phone: parsed.data.phone, name: parsed.data.name },
    extra: { location: parsed.data.location, preferred_date: parsed.data.preferredDate },
  });
  return { ok: true, eventId };
}

export async function saveDraft(data: Record<string, string>) {
  cookies().set("estimate_draft", JSON.stringify(data), {
    maxAge: 60 * 60 * 6,
    path: "/",
  });
}

export async function submitChatLead(input: unknown) {
  if (await publicSiteBlocked()) return { ok: false, error: "The site is under construction." };
  const parsed = chatLeadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid form" };
  if (rateLimited()) return { ok: false, error: "Please wait before submitting again." };

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || "",
    product_interest: parsed.data.product_interest,
    rooms: parsed.data.rooms,
    location: parsed.data.location,
    estimate_min: parsed.data.estimate_min,
    estimate_max: parsed.data.estimate_max,
    booking_date: parsed.data.booking_date || "",
    booking_time: parsed.data.booking_time || "",
    transcript: parsed.data.transcript,
    source: "ai-chatbot",
    status: "new" as const,
  };

  const supabase = createWriteClient();
  if (supabase) {
    const { error } = await supabase.from("chat_leads").insert(payload);
    if (error) return { ok: false, error: error.message };
  } else {
    getStore().chatLeads.unshift({
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    } as ChatLead);
  }

  const eventId = newEventId();
  const booked = Boolean(payload.booking_date && payload.booking_time);
  await notifyAdmin({
    subject: booked ? `New chat booking from ${payload.name}` : `New chat lead from ${payload.name}`,
    heading: booked ? "New chatbot booking" : "New chatbot lead",
    replyTo: payload.email || undefined,
    rows: [
      { label: "Name", value: payload.name },
      { label: "Phone", value: payload.phone },
      { label: "Email", value: payload.email || "" },
      { label: "Product", value: payload.product_interest },
      { label: "Rooms", value: payload.rooms },
      { label: "Location", value: payload.location },
      { label: "Estimate", value: `${(await getSiteSettings()).currency} ${payload.estimate_min}–${payload.estimate_max}` },
      { label: "Booking date", value: payload.booking_date || "" },
      { label: "Booking time", value: payload.booking_time || "" },
    ],
  });
  await trackServerEvent({
    name: booked ? "Schedule" : "Lead",
    eventId,
    sourceUrl: sourceUrl("/"),
    contentName: payload.product_interest,
    contentType: "chat_lead",
    value: payload.estimate_max,
    currency: (await getSiteSettings()).currency || "AED",
    user: { email: payload.email, phone: payload.phone, name: payload.name },
    extra: {
      rooms: payload.rooms,
      location: payload.location,
      source: "ai-chatbot",
      booked: booked ? 1 : 0,
    },
  });
  return { ok: true, eventId };
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
