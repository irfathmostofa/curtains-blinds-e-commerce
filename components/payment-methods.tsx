import type { ReactNode, SVGProps } from "react";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function Label({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-semibold uppercase tracking-wide">{children}</span>;
}

function Wordmark({ label, className }: { label: string; className?: string }) {
  const key = normalize(label);
  if (key.includes("visa")) return <Label>Visa</Label>;
  if (key.includes("master")) return <Label>Mastercard</Label>;
  if (key.includes("amex") || key.includes("americanexpress")) return <Label>Amex</Label>;
  if (key.includes("paypal")) return <Label>PayPal</Label>;
  if (key.includes("apple")) return <Label>Apple Pay</Label>;
  if (key.includes("google")) return <Label>Google Pay</Label>;
  if (key.includes("tabby")) return <Label>Tabby</Label>;
  if (key.includes("tamara")) return <Label>Tamara</Label>;
  if (key.includes("bank")) return <Label>Bank Transfer</Label>;
  if (key.includes("cash")) return <Label>Cash</Label>;
  return <span className={className}>{label}</span>;
}

function CashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10v4M18 10v4" />
    </svg>
  );
}

function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true" {...props}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 19h18" />
    </svg>
  );
}

function MethodIcon({ label }: { label: string }) {
  const key = normalize(label);
  if (key.includes("cash")) return <CashIcon />;
  if (key.includes("bank")) return <BankIcon />;
  return null;
}

export function PaymentBadges({ methods, className }: { methods: string[]; className?: string }) {
  const list = methods.filter((m) => m && m.trim());
  if (!list.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      {list.map((method) => (
        <li
          key={method}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-1 text-primary-foreground/90"
          title={method}
        >
          <MethodIcon label={method} />
          <Wordmark label={method} className="text-[11px] font-medium" />
        </li>
      ))}
    </ul>
  );
}
