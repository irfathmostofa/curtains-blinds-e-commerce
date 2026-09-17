import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";
import { BookingForm } from "./booking-form";

export const metadata = buildMetadata({
  title: "Book a Free Measuring Visit",
  description:
    "Schedule a complimentary curtains and blinds consultation in Dubai or Abu Dhabi. Choose a date, time slot and share your address.",
  path: "/book",
});

export default function BookPage() {
  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Book a visit", path: "/book" }]} />
      <SectionHeading
        as="h1"
        title="Book a free visit"
        subtitle="A consultant brings fabric books, measures every elevation and leaves a written estimate. No obligation."
      />
      <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-6 md:p-10">
        <BookingForm />
      </div>
    </main>
  );
}
