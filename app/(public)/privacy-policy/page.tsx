import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCmsPage, getSiteSettings } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const [page, settings] = await Promise.all([getCmsPage("privacy-policy"), getSiteSettings()]);
  return buildMetadata(
    {
      title: page?.seo_title || "Privacy Policy",
      description: page?.seo_description || "Privacy policy",
      path: "/privacy-policy",
    },
    settings
  );
}

export default async function PrivacyPage() {
  const page = await getCmsPage("privacy-policy");
  if (!page) notFound();
  return (
    <main className="container space-y-6 pt-4 pb-10 md:pt-5">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title, path: "/privacy-policy" }]} />
      <article className="prose prose-stone max-w-3xl">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  );
}
