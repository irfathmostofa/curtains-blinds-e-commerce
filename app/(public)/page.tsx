import {
  getBestsellers,
  getCategories,
  getFaqs,
  getPartners,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data/catalog";
import { buildMetadata, faqJsonLd, localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import { HomeView } from "@/components/home-view";

export const revalidate = 0;

export const metadata = buildMetadata({
  title: "Bespoke Curtains & Blinds in Dubai & Abu Dhabi",
  description:
    "Maison Drape designs and installs custom curtains, blinds and motorised tracks. Free in-home visit, 12-month warranty, Dubai and Abu Dhabi.",
  path: "/",
});

export default async function HomePage() {
  const [settings, categories, bestsellers, testimonials, partners, faqs] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getBestsellers(),
    getTestimonials(),
    getPartners(),
    getFaqs(),
  ]);

  return (
    <HomeView
      settings={settings}
      categories={categories}
      bestsellers={bestsellers}
      testimonials={testimonials}
      partners={partners}
      faqs={faqs}
      orgJson={organizationJsonLd(settings)}
      localJson={localBusinessJsonLd(settings)}
      faqJson={faqJsonLd(faqs.slice(0, 4))}
    />
  );
}
