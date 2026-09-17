import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCmsPage } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await getCmsPage("privacy-policy");
  return buildMetadata({
    title: page?.seo_title || "Privacy Policy",
    description: page?.seo_description || "Privacy policy",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPage() {
  const page = await getCmsPage("privacy-policy");
  if (!page) notFound();
  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title, path: "/privacy-policy" }]} />
      <article className="prose prose-stone max-w-3xl">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  );
}
