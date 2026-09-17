import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCmsPage } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await getCmsPage("terms-of-use");
  return buildMetadata({
    title: page?.seo_title || "Terms of Use",
    description: page?.seo_description || "Terms of use",
    path: "/terms-of-use",
  });
}

export default async function TermsPage() {
  const page = await getCmsPage("terms-of-use");
  if (!page) notFound();
  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title, path: "/terms-of-use" }]} />
      <article className="prose prose-stone max-w-3xl">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  );
}
