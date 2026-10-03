export function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function unescapeStoredHtml(html: string) {
  let next = html.trim();
  for (let i = 0; i < 3; i += 1) {
    if (!/^&lt;\/?[a-z]/i.test(next)) break;
    next = decodeHtmlEntities(next);
  }
  return next;
}

export function sanitizeHtml(html: string) {
  return unescapeStoredHtml(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function normalizeRichText(value: unknown) {
  const raw = value == null ? "" : String(value);
  const html = sanitizeHtml(raw).replace(/<br\s*\/?>/gi, "<br />");
  if (!stripHtml(html) && !/<img\b/i.test(html)) return "";
  if (looksLikeHtml(html)) return html;
  return html
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
    .join("");
}
