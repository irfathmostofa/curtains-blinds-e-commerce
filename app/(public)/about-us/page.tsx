import { AboutView } from "@/components/about-view";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getSiteSettings } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const about = settings.about;
  return buildMetadata({
    title: about.seo_title || about.intro.title || "About Maison Drape",
    description: about.seo_description,
    path: "/about-us",
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const about = settings.about;
  const crumb = about.intro.title || "About";

  return (
    <main className="overflow-x-hidden">
      <div className="container pt-4 md:pt-5">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: crumb, path: "/about-us" }]} />
      </div>
      <AboutView about={about} />
    </main>
  );
}
