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
const WHATSAPP_GRAPH_URL = "https://graph.facebook.com/v21.0";

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

function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

function buildPlainText(heading: string, rows: { label: string; value: string }[], company: string) {
  const body = rows
    .map((row) => `${row.label}: ${row.value || "—"}`)
    .join(" | ");
  return `${heading} | ${body} | ${company}`.replace(/\s+/g, " ").trim();
}

function truncate(value: string, max = 1024) {
  const clean = value.replace(/[\n\t\r]+/g, " ").replace(/ {4,}/g, "   ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

async function sendAdminWhatsApp(
  settings: Awaited<ReturnType<typeof getAdminSiteSettings>>,
  input: NotifyInput,
  company: string
) {
  const token = settings.whatsapp_access_token?.trim();
  const phoneNumberId = settings.whatsapp_phone_number_id?.trim();
  const to = digitsOnly(settings.whatsapp || "");
  if (!token || !phoneNumberId || !to) return;

  const text = truncate(buildPlainText(input.heading, input.rows, company));
  const template = settings.whatsapp_template_name?.trim() || "admin_lead_alert";
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: truncate(input.heading, 60) },
            { type: "text", text },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(`${WHATSAPP_GRAPH_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Failed to send admin WhatsApp notification", res.status, detail);
    }
  } catch (error) {
    console.error("Failed to send admin WhatsApp notification", error);
  }
}

export async function notifyAdmin(input: NotifyInput) {
  const settings = await getAdminSiteSettings();
  const company = resolveSiteName(settings);
  await Promise.all([
    sendAdminEmail(settings, input, company),
    sendAdminWhatsApp(settings, input, company),
  ]);
}

async function sendAdminEmail(
  settings: Awaited<ReturnType<typeof getAdminSiteSettings>>,
  input: NotifyInput,
  company: string
) {
  const apiKey = settings.resend_api_key?.trim();
  const to = parseEmailAddress(settings.email || "");
  if (!apiKey || !to) return;

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
