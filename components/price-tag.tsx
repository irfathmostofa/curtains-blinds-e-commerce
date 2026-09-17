import { formatAed } from "@/lib/utils";

export function PriceTag({
  amount,
  currency = "AED",
  note = "From",
}: {
  amount: number;
  currency?: string;
  note?: string;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      {note}{" "}
      <span className="font-medium text-foreground">
        {currency === "AED" ? formatAed(amount) : `${currency} ${amount}`}
      </span>
    </p>
  );
}
