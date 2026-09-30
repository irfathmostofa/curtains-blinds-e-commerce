import { headers, cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerPixelSecrets } from "@/lib/analytics/config";
import type { AnalyticsEvent } from "@/lib/analytics/events";
import { TIKTOK_EVENT_MAP } from "@/lib/analytics/events";
import { hashUserData } from "@/lib/analytics/hash";
import { getAdminSiteSettings } from "@/lib/data/catalog";
import { resolveSiteUrl } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

type DispatchResult = { platform: string; status: "sent" | "failed" | "skipped"; error?: string };

function clientIp() {
  const h = headers();
  const forwarded = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
  return forwarded.split(",")[0]?.trim() || "";
}

function requestContext() {
  const h = headers();
  const jar = cookies();
  return {
    ip: clientIp(),
    userAgent: h.get("user-agent") || "",
    fbp: jar.get("_fbp")?.value || "",
    fbc: jar.get("_fbc")?.value || "",
    ttp: jar.get("_ttp")?.value || "",
    ttclid: jar.get("ttclid")?.value || "",
  };
}

async function logEvent(
  event: AnalyticsEvent,
  source: "client" | "server",
  platform: "meta" | "tiktok" | "gtm" | "internal",
  status: DispatchResult["status"],
  error = ""
) {
  const supabase = createAdminClient();
  if (!supabase) return;
  await supabase.from("analytics_events").upsert(
    {
      event_name: event.name,
      event_id: `${platform}:${event.eventId}`,
      event_source_url: event.sourceUrl || "",
      source,
      platform,
      payload: event,
      status,
      error,
    },
    { onConflict: "event_id" }
  );
}

async function sendMeta(
  event: AnalyticsEvent,
  pixelId: string,
  accessToken: string,
  testEventCode: string,
  siteUrl: string
) {
  if (!pixelId || !accessToken) return { platform: `meta:${pixelId || "unset"}`, status: "skipped" as const };
  const ctx = requestContext();
  const hashed = hashUserData(event.user || {});
  const body = {
    data: [
      {
        event_name: event.name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.sourceUrl || siteUrl,
        action_source: "website",
        user_data: {
          ...hashed,
          client_ip_address: ctx.ip || undefined,
          client_user_agent: ctx.userAgent || undefined,
          fbp: ctx.fbp || undefined,
          fbc: ctx.fbc || undefined,
        },
        custom_data: {
          currency: event.currency || "AED",
          value: event.value,
          content_name: event.contentName,
          content_ids: event.contentIds,
          content_type: event.contentType || "product",
          ...(event.extra || {}),
        },
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const res = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return { platform: `meta:${pixelId}`, status: "failed" as const, error: text.slice(0, 500) };
  }
  return { platform: `meta:${pixelId}`, status: "sent" as const };
}

async function sendTikTok(event: AnalyticsEvent, settings: SiteSettings, siteUrl: string) {
  const secrets = getServerPixelSecrets(settings).tiktok;
  if (!secrets.pixelId || !secrets.accessToken) {
    return { platform: "tiktok", status: "skipped" as const };
  }
  const ctx = requestContext();
  const hashed = hashUserData(event.user || {});
  const body = {
    event_source: "web",
    event_source_id: secrets.pixelId,
    ...(secrets.testEventCode ? { test_event_code: secrets.testEventCode } : {}),
    data: [
      {
        event: TIKTOK_EVENT_MAP[event.name],
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        user: {
          email: hashed.em,
          phone: hashed.ph,
          ip: ctx.ip || undefined,
          user_agent: ctx.userAgent || undefined,
          ttp: ctx.ttp || undefined,
          ttclid: ctx.ttclid || undefined,
        },
        page: { url: event.sourceUrl || siteUrl },
        properties: {
          currency: event.currency || "AED",
          value: event.value,
          content_name: event.contentName,
          content_id: event.contentIds?.[0],
          content_type: event.contentType || "product",
        },
      },
    ],
  };

  const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": secrets.accessToken,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return { platform: "tiktok", status: "failed" as const, error: text.slice(0, 500) };
  }
  return { platform: "tiktok", status: "sent" as const };
}

export async function trackServerEvent(event: AnalyticsEvent) {
  const consent = cookies().get("cookie_consent")?.value;
  if (consent !== "accepted") return [];

  const settings = await getAdminSiteSettings();
  const siteUrl = resolveSiteUrl(settings);
  const secrets = getServerPixelSecrets(settings);
  const results: DispatchResult[] = [];

  const metaTargets = [
    { id: secrets.meta.pixelId, token: secrets.meta.accessToken, test: secrets.meta.testEventCode, label: "meta" },
    {
      id: secrets.instagram.pixelId,
      token: secrets.instagram.accessToken,
      test: secrets.instagram.testEventCode,
      label: "instagram",
    },
  ].filter((target, index, list) => target.id && list.findIndex((item) => item.id === target.id) === index);

  for (const target of metaTargets) {
    try {
      const result = await sendMeta(event, target.id, target.token, target.test, siteUrl);
      results.push(result);
      await logEvent(event, "server", "meta", result.status, result.error);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Meta CAPI failed";
      results.push({ platform: target.label, status: "failed", error: message });
      await logEvent(event, "server", "meta", "failed", message);
    }
  }

  try {
    const tiktok = await sendTikTok(event, settings, siteUrl);
    results.push(tiktok);
    await logEvent(event, "server", "tiktok", tiktok.status, tiktok.error);
  } catch (error) {
    const message = error instanceof Error ? error.message : "TikTok Events API failed";
    results.push({ platform: "tiktok", status: "failed", error: message });
    await logEvent(event, "server", "tiktok", "failed", message);
  }

  return results;
}
