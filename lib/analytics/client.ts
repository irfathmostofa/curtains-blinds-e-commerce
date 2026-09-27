"use client";

import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/events";
import { newEventId } from "@/lib/analytics/events";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    ttq?: {
      track: (name: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
      page: () => void;
      identify: (payload: Record<string, unknown>) => void;
    };
  }
}

function pushGtm(event: string, payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

function trackMeta(name: AnalyticsEventName, payload: Record<string, unknown>, eventId: string) {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", name, payload, { eventID: eventId });
}

function trackTikTok(name: AnalyticsEventName, payload: Record<string, unknown>, eventId: string) {
  if (!window.ttq?.track) return;
  const map: Record<AnalyticsEventName, string> = {
    PageView: "Pageview",
    ViewContent: "ViewContent",
    Lead: "SubmitForm",
    Schedule: "Schedule",
    Contact: "Contact",
    SubmitApplication: "SubmitForm",
    CompleteRegistration: "CompleteRegistration",
  };
  window.ttq.track(map[name], payload, { event_id: eventId });
}

export function trackClientEvent(partial: Omit<AnalyticsEvent, "eventId"> & { eventId?: string }) {
  if (typeof window === "undefined") return partial.eventId || "";
  const eventId = partial.eventId || newEventId();
  const payload: Record<string, unknown> = {
    content_name: partial.contentName,
    content_ids: partial.contentIds,
    content_type: partial.contentType || "product",
    value: partial.value,
    currency: partial.currency || "AED",
    ...partial.extra,
  };
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  pushGtm(partial.name, { event_id: eventId, ...payload });
  trackMeta(partial.name, payload, eventId);
  trackTikTok(partial.name, payload, eventId);
  return eventId;
}

export function trackPageView(path: string) {
  return trackClientEvent({
    name: "PageView",
    contentName: path,
    extra: { page_path: path },
  });
}
