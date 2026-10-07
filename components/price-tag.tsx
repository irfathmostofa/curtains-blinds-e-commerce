import { formatMoney } from "@/lib/utils";
import { useSiteConfig } from "@/components/site-config";

export function PriceTag({
  amount,
  currency,
  note = "From",
}: {
  amount: number;
  currency?: string;
  note?: string;
}) {
  const config = useSiteConfig();
  const code = currency || config.currency || "AED";
  return (
    <p className="text-sm text-muted-foreground">
      {note}{" "}
      <span className="font-medium text-foreground">{formatMoney(amount, code)}</span>
    </p>
  );
}
