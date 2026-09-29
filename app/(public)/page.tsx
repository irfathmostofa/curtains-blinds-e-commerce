import { HomeView } from "@/components/home-view";
import {
  getBestsellers,
  getCategories,
  getFaqs,
  getPartners,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data/catalog";
import { buildMetadata, faqJsonLd, localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Bespoke Curtains & Blinds in Dubai & Abu Dhabi",
  description:
    "Maison Drape designs and installs custom curtains, blinds and motorised tracks. Free in-home visit, 12-month warranty, Dubai and Abu Dhabi.",
  path: "/",
  keywords:
    "curtains Dubai, custom curtains Dubai, blackout curtains Dubai, blinds Abu Dhabi, motorised curtains UAE, free curtain measuring Dubai",
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
