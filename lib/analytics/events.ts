export type AnalyticsEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Schedule"
  | "Contact"
  | "SubmitApplication"
  | "CompleteRegistration";

export type AnalyticsUser = {
  email?: string;
  phone?: string;
  name?: string;
};

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  eventId: string;
  sourceUrl?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
  contentType?: string;
  user?: AnalyticsUser;
  extra?: Record<string, string | number | boolean>;
};

export function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const TIKTOK_EVENT_MAP: Record<AnalyticsEventName, string> = {
  PageView: "Pageview",
  ViewContent: "ViewContent",
  Lead: "SubmitForm",
  Schedule: "Schedule",
  Contact: "Contact",
  SubmitApplication: "SubmitForm",
  CompleteRegistration: "CompleteRegistration",
};
