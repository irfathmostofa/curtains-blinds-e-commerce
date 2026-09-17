import { Breadcrumbs } from "@/components/breadcrumbs";
import { FAQAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { getFaqs } from "@/lib/data/catalog";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Curtains & Blinds FAQs",
  description: "Lead times, free visits, motors, warranties and trade pricing for Maison Drape in Dubai and Abu Dhabi.",
  path: "/faqs",
});

export default async function FaqsPage() {
  const faqs = await getFaqs();
  return (
    <main className="container space-y-8 py-10">
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQs", path: "/faqs" }]} />
      <SectionHeading as="h1" title="Frequently asked questions" subtitle="Answers rendered as real text so you — and search engines — can read them." />
      <FAQAccordion items={faqs} />
    </main>
  );
}
