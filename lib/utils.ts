import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_LOCALES: Record<string, string> = {
  AED: "en-AE",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  SAR: "en-SA",
  QAR: "en-QA",
  KWD: "en-KW",
  BHD: "en-BH",
  OMR: "en-OM",
  INR: "en-IN",
  PKR: "en-PK",
  EGP: "en-EG",
};

export function formatMoney(amount: number, currency = "AED") {
  const code = (currency || "AED").toUpperCase();
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[code] || "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${amount}`;
  }
}

export function formatAed(amount: number, currency = "AED") {
  return formatMoney(amount, currency);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path = "/", baseUrl?: string) {
  const base = (baseUrl || "http://localhost:3000").replace(/\/$/, "");
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
