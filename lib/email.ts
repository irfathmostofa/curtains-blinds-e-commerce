import { getAdminSiteSettings } from "@/lib/data/catalog";
import { resolveSiteName } from "@/lib/site";

type NotifyInput = {
  subject: string;
  heading: string;
  rows: { label: string; value: string }[];
  replyTo?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";
const WHATSAPP_GRAPH_URL = "https://graph.facebook.com/v21.0";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDetailsTable(rows: { label: string; value: string }[]) {
  const visible = rows.filter((row) => row.value?.trim());
  return visible
    .map(
      (row) =>
        `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #E8DFD2;width:38%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8A7A66;font-family:Georgia,'Times New Roman',serif">${escapeHtml(row.label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #E8DFD2;font-size:15px;line-height:1.5;color:#2C241C;font-family:Georgia,'Times New Roman',serif;text-align:right">${escapeHtml(row.value)}</td>
        </tr>`.replace(/\n\s+/g, "")
    )
    .join("");
}

function buildHtml(input: {
  heading: string;
  intro: string;
  rows: { label: string; value: string }[];
  company: string;
  greeting?: string;
}) {
  const year = new Date().getFullYear();
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:#F4EFE6">
  <tr>
    <td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFbf6;border:1px solid #E8DFD2">
        <tr>
          <td style="padding:28px 36px 24px;background:#3D3224;text-align:center">
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C4A46A">Made to measure</p>
            <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#F7F1E6">${escapeHtml(input.company)}</p>
          </td>
        </tr>
        <tr>
          <td style="height:3px;background:#C4A46A;font-size:0;line-height:0">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:36px 36px 8px">
            ${input.greeting ? `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#2C241C">${escapeHtml(input.greeting)}</p>` : ""}
            <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;font-weight:normal;color:#3D3224">${escapeHtml(input.heading)}</h1>
            <p style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#5C5146">${escapeHtml(input.intro)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${buildDetailsTable(input.rows)}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 36px">
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;line-height:1.6;color:#8A7A66">With kind regards,<br><span style="color:#3D3224">${escapeHtml(input.company)}</span></p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;background:#F7F1E6;border-top:1px solid #E8DFD2;text-align:center">
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A7A66">Curtains, blinds and window treatments</p>
            <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#A0907C">&copy; ${year} ${escapeHtml(input.company)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function parseEmailAddress(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  const angled = raw.match(/<([^>]+)>/);
  const email = (angled ? angled[1] : raw).trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : "";
}

function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

function buildPlainText(heading: string, rows: { label: string; value: string }[], company: string) {
  const body = rows
    .filter((row) => row.value?.trim())
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");
  return `${heading}\n\n${body}\n\n${company}`.trim();
}

function truncate(value: string, max = 1024) {
  const clean = value.replace(/[\n\t\r]+/g, " ").replace(/ {4,}/g, "   ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

function rowValue(rows: { label: string; value: string }[], label: string) {
  return rows.find((row) => row.label.toLowerCase() === label.toLowerCase())?.value || "";
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

export async function notifyCustomer(input: NotifyInput & { to?: string }) {
  const settings = await getAdminSiteSettings();
  const company = resolveSiteName(settings);
  const to = parseEmailAddress(input.to || input.replyTo || "");
  if (!to) return;
  const name = rowValue(input.rows, "Name");
  const intro =
    "Thank you for writing to us. We have received your request and a consultant will follow up, usually the same working day.";
  await sendMail(settings, {
    to,
    replyTo: parseEmailAddress(settings.email || "") || undefined,
    subject: input.subject,
    html: buildHtml({
      heading: input.heading,
      intro,
      rows: input.rows,
      company,
      greeting: name ? `Dear ${name},` : "Dear customer,",
    }),
    heading: input.heading,
    intro,
    message: buildPlainText(input.heading, input.rows, company),
    toName: name,
    company,
  });
}

async function sendMail(
  settings: Awaited<ReturnType<typeof getAdminSiteSettings>>,
  input: {
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    heading: string;
    intro: string;
    message: string;
    toName?: string;
    company: string;
  }
) {
  const serviceId = settings.emailjs_service_id?.trim();
  const templateId = settings.emailjs_template_id?.trim();
  const publicKey = settings.emailjs_public_key?.trim();
  const privateKey = settings.emailjs_private_key?.trim();
  if (!serviceId || !templateId || !publicKey) return;

  const payload: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: input.to,
      to_name: input.toName || input.to,
      from_name: input.company,
      reply_to: input.replyTo || input.to,
      subject: input.subject,
      heading: input.heading,
      intro: input.intro,
      message: input.message,
      html: input.html,
      company: input.company,
      year: String(new Date().getFullYear()),
    },
  };
  if (privateKey) payload.accessToken = privateKey;

  try {
    const res = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Failed to send email", res.status, detail);
    }
  } catch (error) {
    console.error("Failed to send email", error);
  }
}

async function sendAdminEmail(
  settings: Awaited<ReturnType<typeof getAdminSiteSettings>>,
  input: NotifyInput,
  company: string
) {
  const to = parseEmailAddress(settings.email || "");
  if (!to) return;
  const intro = "A new enquiry has arrived. The details are below.";
  await sendMail(settings, {
    to,
    replyTo: parseEmailAddress(input.replyTo || "") || undefined,
    subject: input.subject,
    html: buildHtml({
      heading: input.heading,
      intro,
      rows: input.rows,
      company,
    }),
    heading: input.heading,
    intro,
    message: buildPlainText(input.heading, input.rows, company),
    toName: company,
    company,
  });
}
