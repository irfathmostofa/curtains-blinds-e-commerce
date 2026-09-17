import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  const Heading = as;
  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      ) : null}
      <Heading className="text-3xl md:text-4xl text-balance">{title}</Heading>
      {subtitle ? <p className="text-muted-foreground leading-relaxed">{subtitle}</p> : null}
    </div>
  );
}
