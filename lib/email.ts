import { Resend } from "resend";
import { getAdminSiteSettings } from "@/lib/data/catalog";
import { resolveSiteName } from "@/lib/site";

type NotifyInput = {
  subject: string;
  heading: string;
  rows: { label: string; value: string }[];
  replyTo?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PUBLIC_INBOX_HOSTS = new Set(["gmail.com", "googlemail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "icloud.com"]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(heading: string, rows: { label: string; value: string }[], company: string) {
  const body = rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:160px">${escapeHtml(row.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(row.value || "—")}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <h1 style="font-size:22px;margin:0 0 16px">${escapeHtml(heading)}</h1>
  <table style="width:100%;border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${body}</table>
  <p style="margin:24px 0 0;font-size:12px;color:#888">${escapeHtml(company)}</p>
</div>`;
}

export function parseEmailAddress(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  const angled = raw.match(/<([^>]+)>/);
  const email = (angled ? angled[1] : raw).trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : "";
}

export function isPublicInboxHost(email: string) {
  const host = parseEmailAddress(email).split("@")[1] || "";
  return PUBLIC_INBOX_HOSTS.has(host);
}

export function formatFromAddress(from: string, company: string) {
  const email = parseEmailAddress(from);
  if (!email || isPublicInboxHost(email)) return `${company} <onboarding@resend.dev>`;
  if (from.includes("<") && from.includes(">")) return from.trim();
  return `${company} <${email}>`;
}

export async function notifyAdmin(input: NotifyInput) {
  const settings = await getAdminSiteSettings();
  const apiKey = settings.resend_api_key?.trim();
  const to = parseEmailAddress(settings.email || "");
  if (!apiKey || !to) return;

  const company = resolveSiteName(settings);
  const from = formatFromAddress(settings.resend_from_email || "", company);
  const replyTo = parseEmailAddress(input.replyTo || "") || undefined;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject: input.subject,
      html: buildHtml(input.heading, input.rows, company),
    });
    if (error) console.error("Failed to send admin notification email", error);
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}
