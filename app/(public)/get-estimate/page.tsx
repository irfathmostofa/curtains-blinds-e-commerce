import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";
import { EstimateForm } from "./estimate-form";

export const metadata = buildMetadata({
  title: "Get a Curtains & Blinds Estimate",
  description:
    "Tell us room count, product type and budget. Maison Drape replies the same working day with a starting estimate for Dubai and Abu Dhabi.",
  path: "/get-estimate",
});

export default function GetEstimatePage() {
  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Get estimate", path: "/get-estimate" }]} />
      <SectionHeading
        as="h1"
        title="Get an estimate"
        subtitle="Four short steps. We store your progress if you refresh, and a consultant replies the same working day."
      />
      <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-6 md:p-10">
        <EstimateForm />
      </div>
    </main>
  );
}
