import { Resend } from "resend";
import { getSiteSettings } from "@/lib/data/catalog";
import { SITE_NAME } from "@/lib/site";

type NotifyInput = {
  subject: string;
  heading: string;
  rows: { label: string; value: string }[];
  replyTo?: string;
};

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

export async function notifyAdmin(input: NotifyInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const settings = await getSiteSettings();
  const to = settings.email?.trim();
  if (!to) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Maison Drape <onboarding@resend.dev>";
  const company = settings.company_name || SITE_NAME;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: input.replyTo || undefined,
      subject: input.subject,
      html: buildHtml(input.heading, input.rows, company),
    });
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}
