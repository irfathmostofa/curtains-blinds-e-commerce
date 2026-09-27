import { createHash } from "crypto";

export function sha256(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

export function normalizePhone(phone?: string | null) {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return digits.startsWith("00") ? digits.slice(2) : digits;
}

export function hashUserData(input: { email?: string; phone?: string; name?: string }) {
  const [first, ...rest] = (input.name || "").trim().split(/\s+/);
  const last = rest.join(" ");
  return {
    em: sha256(input.email),
    ph: sha256(normalizePhone(input.phone)),
    fn: sha256(first),
    ln: sha256(last),
  };
}
